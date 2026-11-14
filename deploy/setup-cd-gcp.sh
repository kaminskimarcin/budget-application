#!/usr/bin/env bash
set -euo pipefail

PROJECT_ID="${PROJECT_ID:-budget-companions}"
REGION="${REGION:-europe-central2}"
GITHUB_REPO="${GITHUB_REPO:-kaminskimarcin/budget-application}"
REPOSITORY="${REPOSITORY:-budget-repo}"
WEB_BUCKET="${WEB_BUCKET:-$PROJECT_ID-web}"
SECRET_NAME="${SECRET_NAME:-budget-db-password}"
POOL="${POOL:-github-pool}"
PROVIDER="${PROVIDER:-github-provider}"
DEPLOY_SA_NAME="${DEPLOY_SA_NAME:-github-deployer}"
RUN_SA_NAME="${RUN_SA_NAME:-budget-api-run}"

DEPLOY_SA="$DEPLOY_SA_NAME@$PROJECT_ID.iam.gserviceaccount.com"
RUN_SA="$RUN_SA_NAME@$PROJECT_ID.iam.gserviceaccount.com"

gcloud config set project "$PROJECT_ID"
PROJECT_NUMBER=$(gcloud projects describe "$PROJECT_ID" --format='value(projectNumber)')

gcloud services enable \
  run.googleapis.com \
  artifactregistry.googleapis.com \
  iam.googleapis.com \
  iamcredentials.googleapis.com \
  sts.googleapis.com \
  storage.googleapis.com \
  secretmanager.googleapis.com

if ! gcloud artifacts repositories describe "$REPOSITORY" --location="$REGION" >/dev/null 2>&1; then
  gcloud artifacts repositories create "$REPOSITORY" --location="$REGION" --repository-format=docker
fi

POLICY_FILE=$(mktemp)
cat > "$POLICY_FILE" <<JSON
[
  {"name": "keep-last-3", "action": {"type": "Keep"}, "mostRecentVersions": {"keepCount": 3}},
  {"name": "delete-old", "action": {"type": "Delete"}, "condition": {"tagState": "any", "olderThan": "86400s"}}
]
JSON
gcloud artifacts repositories set-cleanup-policies "$REPOSITORY" --location="$REGION" --policy="$POLICY_FILE" --no-dry-run
rm -f "$POLICY_FILE"

if ! gcloud storage buckets describe "gs://$WEB_BUCKET" >/dev/null 2>&1; then
  gcloud storage buckets create "gs://$WEB_BUCKET" --location="$REGION" --uniform-bucket-level-access
fi
gcloud storage buckets update "gs://$WEB_BUCKET" --web-main-page-suffix=index.html
gcloud storage buckets add-iam-policy-binding "gs://$WEB_BUCKET" --member=allUsers --role=roles/storage.objectViewer >/dev/null

for SA_NAME in "$DEPLOY_SA_NAME" "$RUN_SA_NAME"; do
  if ! gcloud iam service-accounts describe "$SA_NAME@$PROJECT_ID.iam.gserviceaccount.com" >/dev/null 2>&1; then
    gcloud iam service-accounts create "$SA_NAME"
  fi
done

gcloud secrets add-iam-policy-binding "$SECRET_NAME" \
  --member="serviceAccount:$RUN_SA" --role=roles/secretmanager.secretAccessor >/dev/null

for ROLE in roles/run.admin roles/compute.networkUser; do
  gcloud projects add-iam-policy-binding "$PROJECT_ID" \
    --member="serviceAccount:$DEPLOY_SA" --role="$ROLE" --condition=None >/dev/null
done

gcloud artifacts repositories add-iam-policy-binding "$REPOSITORY" --location="$REGION" \
  --member="serviceAccount:$DEPLOY_SA" --role=roles/artifactregistry.writer >/dev/null

for ROLE in roles/storage.objectAdmin roles/storage.legacyBucketReader; do
  gcloud storage buckets add-iam-policy-binding "gs://$WEB_BUCKET" \
    --member="serviceAccount:$DEPLOY_SA" --role="$ROLE" >/dev/null
done

gcloud iam service-accounts add-iam-policy-binding "$RUN_SA" \
  --member="serviceAccount:$DEPLOY_SA" --role=roles/iam.serviceAccountUser >/dev/null

if ! gcloud iam workload-identity-pools describe "$POOL" --location=global >/dev/null 2>&1; then
  gcloud iam workload-identity-pools create "$POOL" --location=global --display-name="GitHub Actions"
fi

if ! gcloud iam workload-identity-pools providers describe "$PROVIDER" --location=global --workload-identity-pool="$POOL" >/dev/null 2>&1; then
  gcloud iam workload-identity-pools providers create-oidc "$PROVIDER" \
    --location=global \
    --workload-identity-pool="$POOL" \
    --display-name="GitHub OIDC" \
    --issuer-uri="https://token.actions.githubusercontent.com" \
    --attribute-mapping="google.subject=assertion.sub,attribute.repository=assertion.repository,attribute.ref=assertion.ref" \
    --attribute-condition="assertion.repository=='$GITHUB_REPO' && assertion.ref=='refs/heads/main'"
fi

gcloud iam service-accounts add-iam-policy-binding "$DEPLOY_SA" \
  --role=roles/iam.workloadIdentityUser \
  --member="principalSet://iam.googleapis.com/projects/$PROJECT_NUMBER/locations/global/workloadIdentityPools/$POOL/attribute.repository/$GITHUB_REPO" >/dev/null

printf '\nGitHub -> Settings -> Secrets and variables -> Actions\n\n'
printf 'Secret   GCP_WIF_PROVIDER = projects/%s/locations/global/workloadIdentityPools/%s/providers/%s\n' "$PROJECT_NUMBER" "$POOL" "$PROVIDER"
printf 'Secret   GCP_DEPLOY_SA    = %s\n' "$DEPLOY_SA"
printf 'Secret   GCP_RUN_SA       = %s\n' "$RUN_SA"
printf 'Variable GCP_PROJECT_ID   = %s\n' "$PROJECT_ID"
