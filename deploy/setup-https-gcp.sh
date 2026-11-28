#!/usr/bin/env bash
set -euo pipefail

PROJECT_ID="${PROJECT_ID:-budget-companions}"
REGION="${REGION:-europe-central2}"
SERVICE="${SERVICE:-budget-api}"
WEB_BUCKET="${WEB_BUCKET:-$PROJECT_ID-web}"
PREFIX="${PREFIX:-budget}"
RISKY_PORTS="${RISKY_PORTS:-22 3389 5432 3306 27017 8080}"

IP_NAME="$PREFIX-lb-ip"
WEB_BACKEND="$PREFIX-web-backend"
API_NEG="$PREFIX-api-neg"
API_BACKEND="$PREFIX-api-backend"
HTTPS_MAP="$PREFIX-https-map"
HTTP_MAP="$PREFIX-http-redirect"
CERT="$PREFIX-cert"
SSL_POLICY="$PREFIX-ssl-policy"
HTTPS_PROXY="$PREFIX-https-proxy"
HTTP_PROXY="$PREFIX-http-proxy"
HTTPS_RULE="$PREFIX-https-rule"
HTTP_RULE="$PREFIX-http-rule"

gcloud config set project "$PROJECT_ID"
gcloud services enable compute.googleapis.com run.googleapis.com

RISKY=$(gcloud compute firewall-rules list --format=json | jq -r --arg ports "$RISKY_PORTS" '
  def covers($p): (split("-") | map(tonumber)) as $r | ($r[0] <= $p and $p <= ($r[1] // $r[0]));
  ($ports | split(" ") | map(tonumber)) as $risky
  | .[]
  | select(.direction == "INGRESS" and (.disabled | not) and ((.sourceRanges // []) | index("0.0.0.0/0")) and .allowed != null)
  | select(any(.allowed[]; .IPProtocol == "all" or ((.IPProtocol == "tcp" or .IPProtocol == "udp") and ((.ports // ["0-65535"]) as $ps | any($risky[]; . as $p | any($ps[]; covers($p)))))))
  | .name')
for RULE in $RISKY; do
  gcloud compute firewall-rules delete "$RULE" --quiet
done

if ! gcloud compute addresses describe "$IP_NAME" --global >/dev/null 2>&1; then
  gcloud compute addresses create "$IP_NAME" --global --ip-version=IPV4
fi
LB_IP=$(gcloud compute addresses describe "$IP_NAME" --global --format='value(address)')
DOMAIN="${DOMAIN:-${LB_IP//./-}.nip.io}"

if ! gcloud compute backend-buckets describe "$WEB_BACKEND" >/dev/null 2>&1; then
  gcloud compute backend-buckets create "$WEB_BACKEND" --gcs-bucket-name="$WEB_BUCKET" --no-enable-cdn
fi

if ! gcloud compute network-endpoint-groups describe "$API_NEG" --region="$REGION" >/dev/null 2>&1; then
  gcloud compute network-endpoint-groups create "$API_NEG" --region="$REGION" \
    --network-endpoint-type=serverless --cloud-run-service="$SERVICE"
fi

if ! gcloud compute backend-services describe "$API_BACKEND" --global >/dev/null 2>&1; then
  gcloud compute backend-services create "$API_BACKEND" --global --load-balancing-scheme=EXTERNAL_MANAGED
fi
if ! gcloud compute backend-services describe "$API_BACKEND" --global --format='value(backends[].group)' | grep -q "$API_NEG"; then
  gcloud compute backend-services add-backend "$API_BACKEND" --global \
    --network-endpoint-group="$API_NEG" --network-endpoint-group-region="$REGION"
fi

BASE="https://www.googleapis.com/compute/v1/projects/$PROJECT_ID/global"
MAP_FILE=$(mktemp)
cat > "$MAP_FILE" <<YAML
name: $HTTPS_MAP
defaultService: $BASE/backendBuckets/$WEB_BACKEND
hostRules:
- hosts: ['*']
  pathMatcher: app
pathMatchers:
- name: app
  defaultService: $BASE/backendBuckets/$WEB_BACKEND
  pathRules:
  - paths: ['/api', '/api/*', '/actuator/health', '/actuator/info']
    service: $BASE/backendServices/$API_BACKEND
YAML
gcloud compute url-maps import "$HTTPS_MAP" --global --source="$MAP_FILE" --quiet

cat > "$MAP_FILE" <<YAML
name: $HTTP_MAP
defaultUrlRedirect:
  httpsRedirect: true
  redirectResponseCode: MOVED_PERMANENTLY_DEFAULT
  stripQuery: false
YAML
gcloud compute url-maps import "$HTTP_MAP" --global --source="$MAP_FILE" --quiet
rm -f "$MAP_FILE"

if ! gcloud compute ssl-certificates describe "$CERT" --global >/dev/null 2>&1; then
  gcloud compute ssl-certificates create "$CERT" --global --domains="$DOMAIN"
fi

if ! gcloud compute ssl-policies describe "$SSL_POLICY" --global >/dev/null 2>&1; then
  gcloud compute ssl-policies create "$SSL_POLICY" --global --profile=MODERN --min-tls-version=1.2
fi

if ! gcloud compute target-https-proxies describe "$HTTPS_PROXY" --global >/dev/null 2>&1; then
  gcloud compute target-https-proxies create "$HTTPS_PROXY" --global \
    --url-map="$HTTPS_MAP" --ssl-certificates="$CERT" --ssl-policy="$SSL_POLICY"
fi

if ! gcloud compute target-http-proxies describe "$HTTP_PROXY" --global >/dev/null 2>&1; then
  gcloud compute target-http-proxies create "$HTTP_PROXY" --global --url-map="$HTTP_MAP"
fi

if ! gcloud compute forwarding-rules describe "$HTTPS_RULE" --global >/dev/null 2>&1; then
  gcloud compute forwarding-rules create "$HTTPS_RULE" --global --load-balancing-scheme=EXTERNAL_MANAGED \
    --address="$IP_NAME" --target-https-proxy="$HTTPS_PROXY" --ports=443
fi

if ! gcloud compute forwarding-rules describe "$HTTP_RULE" --global >/dev/null 2>&1; then
  gcloud compute forwarding-rules create "$HTTP_RULE" --global --load-balancing-scheme=EXTERNAL_MANAGED \
    --address="$IP_NAME" --target-http-proxy="$HTTP_PROXY" --ports=80
fi

gcloud run services update "$SERVICE" --region="$REGION" \
  --ingress=internal-and-cloud-load-balancing \
  --update-env-vars="CORS_ALLOWED_ORIGINS=https://$DOMAIN" --quiet

gcloud compute firewall-rules list \
  --format='table(name, network.basename(), direction, priority, sourceRanges.list(), allowed[].map().firewall_rule().list(), denied[].map().firewall_rule().list(), targetTags.list())'

printf '\nGitHub -> Settings -> Secrets and variables -> Actions -> Variables\n\n'
printf 'Variable APP_DOMAIN = %s\n\n' "$DOMAIN"
printf 'https://%s\n' "$DOMAIN"
gcloud compute ssl-certificates describe "$CERT" --global --format='value(managed.status, managed.domainStatus)'
