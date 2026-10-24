#!/bin/bash
set -euo pipefail

cd "$(dirname "$0")"
gunzip -c budget-api.tar.gz | docker load

umask 077
cat > /etc/budget-api.env <<ENV
DB_HOST=$DB_HOST
DB_PORT=5432
DB_NAME=$DB_NAME
DB_USER=$DB_USER
DB_PASSWORD=$(gcloud secrets versions access latest --secret="$SECRET_NAME")
CORS_ALLOWED_ORIGINS=$CORS_ALLOWED_ORIGINS
ENV

docker rm -f budget-api 2>/dev/null || true
docker run -d --name budget-api --restart unless-stopped -p 8080:8080 --env-file /etc/budget-api.env budget-api

until curl -sf http://localhost:8080/actuator/health >/dev/null; do sleep 5; done
docker ps
curl -s http://localhost:8080/api/budgets
