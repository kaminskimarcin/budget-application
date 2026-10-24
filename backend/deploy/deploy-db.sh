#!/usr/bin/env bash
set -euo pipefail

PROJECT_ID="${PROJECT_ID:-budget-companions}"
ZONE="${ZONE:-europe-central2-a}"
VM_NAME="${VM_NAME:-budget-db-1}"
MACHINE_TYPE="${MACHINE_TYPE:-e2-micro}"
SUBNET="${SUBNET:-budget-private-db}"
DB_IP="${DB_IP:-10.0.3.10}"
DB_NAME="${DB_NAME:-budget}"
DB_USER="${DB_USER:-budget}"
SECRET_NAME="${SECRET_NAME:-budget-db-password}"

gcloud config set project "$PROJECT_ID"
gcloud services enable secretmanager.googleapis.com

if ! gcloud secrets describe "$SECRET_NAME" >/dev/null 2>&1; then
  openssl rand -base64 24 | tr -d '\n/+=' | gcloud secrets create "$SECRET_NAME" --data-file=- --replication-policy=automatic
fi

PROJECT_NUMBER=$(gcloud projects describe "$PROJECT_ID" --format='value(projectNumber)')
gcloud secrets add-iam-policy-binding "$SECRET_NAME" \
  --member="serviceAccount:${PROJECT_NUMBER}-compute@developer.gserviceaccount.com" \
  --role=roles/secretmanager.secretAccessor >/dev/null

if ! gcloud compute instances describe "$VM_NAME" --zone="$ZONE" >/dev/null 2>&1; then
  gcloud compute instances create "$VM_NAME" \
    --zone="$ZONE" \
    --machine-type="$MACHINE_TYPE" \
    --subnet="$SUBNET" \
    --private-network-ip="$DB_IP" \
    --no-address \
    --tags=db \
    --image-family=debian-12 --image-project=debian-cloud \
    --boot-disk-size=10GB \
    --scopes=cloud-platform \
    --metadata=db-name="$DB_NAME",db-user="$DB_USER",db-secret="$SECRET_NAME" \
    --metadata-from-file=startup-script=deploy/db-startup.sh
  sleep 60
fi

gcloud compute ssh "$VM_NAME" --zone="$ZONE" --tunnel-through-iap -- '
  until sudo docker inspect -f "{{.State.Health.Status}}" budget-db 2>/dev/null | grep -q healthy; do sleep 10; done
  sudo docker ps
'

gcloud compute instances describe "$VM_NAME" --zone="$ZONE" \
  --format='table(name, networkInterfaces[0].subnetwork.basename(), networkInterfaces[0].networkIP, networkInterfaces[0].accessConfigs[0].natIP, tags.items)'
