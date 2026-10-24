#!/bin/bash
set -e

if ! command -v docker >/dev/null; then
  apt-get update
  apt-get install -y docker.io
  systemctl enable --now docker
fi

if docker inspect budget-db >/dev/null 2>&1; then
  docker start budget-db
  exit 0
fi

MD=http://metadata.google.internal/computeMetadata/v1/instance/attributes
DB_NAME=$(curl -s -H "Metadata-Flavor: Google" "$MD/db-name")
DB_USER=$(curl -s -H "Metadata-Flavor: Google" "$MD/db-user")
DB_SECRET=$(curl -s -H "Metadata-Flavor: Google" "$MD/db-secret")
DB_PASSWORD=$(gcloud secrets versions access latest --secret="$DB_SECRET")

docker run -d --name budget-db --restart unless-stopped \
  -p 5432:5432 \
  -e POSTGRES_DB="$DB_NAME" \
  -e POSTGRES_USER="$DB_USER" \
  -e POSTGRES_PASSWORD="$DB_PASSWORD" \
  -v /var/lib/budget-db:/var/lib/postgresql/data \
  --health-cmd="pg_isready -U $DB_USER -d $DB_NAME" \
  --health-interval=10s \
  postgres:16-alpine
