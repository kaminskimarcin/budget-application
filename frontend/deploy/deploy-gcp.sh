#!/usr/bin/env bash
# Wdrożenie frontendu na VM w podsieci publicznej budget-public-web (uruchamiać w Cloud Shell z katalogu frontend/).
set -euo pipefail

PROJECT_ID="${PROJECT_ID:-budget-companions}"
ZONE="${ZONE:-europe-central2-a}"
VM_NAME="${VM_NAME:-budget-web-1}"
MACHINE_TYPE="${MACHINE_TYPE:-e2-micro}"
SUBNET="${SUBNET:-budget-public-web}"

gcloud config set project "$PROJECT_ID"

if ! gcloud compute instances describe "$VM_NAME" --zone="$ZONE" >/dev/null 2>&1; then
  echo ">> Tworzę VM $VM_NAME ($MACHINE_TYPE) w podsieci $SUBNET"
  gcloud compute instances create "$VM_NAME" \
    --zone="$ZONE" \
    --machine-type="$MACHINE_TYPE" \
    --subnet="$SUBNET" \
    --tags=web \
    --image-family=debian-12 --image-project=debian-cloud \
    --boot-disk-size=10GB \
    --metadata=startup-script='#!/bin/bash
apt-get update && apt-get install -y docker.io && systemctl enable --now docker'
  echo ">> Czekam na instalację Dockera (ok. 2 min)"
  sleep 120
fi

echo ">> Pakuję frontend (bez node_modules, dist, .env*)"
tar --exclude=node_modules --exclude=dist --exclude='.env' --exclude='.env.local' -czf /tmp/frontend.tgz .

gcloud compute scp /tmp/frontend.tgz "$VM_NAME":~/frontend.tgz --zone="$ZONE" --tunnel-through-iap

echo ">> Buduję obraz i uruchamiam kontener na VM"
gcloud compute ssh "$VM_NAME" --zone="$ZONE" --tunnel-through-iap -- '
  set -e
  until command -v docker >/dev/null; do echo "czekam na docker..."; sleep 10; done
  rm -rf ~/frontend && mkdir ~/frontend && tar -xzf ~/frontend.tgz -C ~/frontend
  cd ~/frontend
  sudo docker build -t budget-frontend .
  sudo docker rm -f web 2>/dev/null || true
  sudo docker run -d --name web --restart unless-stopped -p 80:80 budget-frontend
  sudo docker ps
'

gcloud compute instances describe "$VM_NAME" --zone="$ZONE" \
  --format='table(name, networkInterfaces[0].subnetwork.basename(), networkInterfaces[0].networkIP, networkInterfaces[0].accessConfigs[0].natIP, tags.items)'

EXTERNAL_IP=$(gcloud compute instances describe "$VM_NAME" --zone="$ZONE" \
  --format='value(networkInterfaces[0].accessConfigs[0].natIP)')
echo ">> Aplikacja: http://${EXTERNAL_IP}"
echo ">> Po screenach zatrzymaj VM: gcloud compute instances stop $VM_NAME --zone=$ZONE"
