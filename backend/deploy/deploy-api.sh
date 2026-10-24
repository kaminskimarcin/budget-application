#!/usr/bin/env bash
set -euo pipefail

PROJECT_ID="${PROJECT_ID:-budget-companions}"
ZONE="${ZONE:-europe-central2-a}"
VM_NAME="${VM_NAME:-budget-api-1}"
MACHINE_TYPE="${MACHINE_TYPE:-e2-micro}"
SUBNET="${SUBNET:-budget-private-api}"
API_IP="${API_IP:-10.0.2.10}"
DB_HOST="${DB_HOST:-10.0.3.10}"
DB_NAME="${DB_NAME:-budget}"
DB_USER="${DB_USER:-budget}"
SECRET_NAME="${SECRET_NAME:-budget-db-password}"
CORS_ALLOWED_ORIGINS="${CORS_ALLOWED_ORIGINS:-http://localhost:5173}"

gcloud config set project "$PROJECT_ID"

if ! gcloud compute instances describe "$VM_NAME" --zone="$ZONE" >/dev/null 2>&1; then
  gcloud compute instances create "$VM_NAME" \
    --zone="$ZONE" \
    --machine-type="$MACHINE_TYPE" \
    --subnet="$SUBNET" \
    --private-network-ip="$API_IP" \
    --no-address \
    --tags=api \
    --image-family=debian-12 --image-project=debian-cloud \
    --boot-disk-size=10GB \
    --scopes=cloud-platform \
    --metadata=startup-script='#!/bin/bash
command -v docker >/dev/null || (apt-get update && apt-get install -y docker.io && systemctl enable --now docker)'
  sleep 60
fi

docker build -t budget-api .
docker save budget-api | gzip > /tmp/budget-api.tar.gz

gcloud compute scp /tmp/budget-api.tar.gz deploy/api-run.sh "$VM_NAME":~ --zone="$ZONE" --tunnel-through-iap

gcloud compute ssh "$VM_NAME" --zone="$ZONE" --tunnel-through-iap -- "
  set -e
  until command -v docker >/dev/null; do sleep 10; done
  sudo env DB_HOST='$DB_HOST' DB_NAME='$DB_NAME' DB_USER='$DB_USER' SECRET_NAME='$SECRET_NAME' CORS_ALLOWED_ORIGINS='$CORS_ALLOWED_ORIGINS' bash ~/api-run.sh
"

gcloud compute instances describe "$VM_NAME" --zone="$ZONE" \
  --format='table(name, networkInterfaces[0].subnetwork.basename(), networkInterfaces[0].networkIP, networkInterfaces[0].accessConfigs[0].natIP, tags.items)'
