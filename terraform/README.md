# Terraform – sieć Budget Application (Blok 03)

Infrastruktura sieciowa 3-tier w GCP (region `europe-central2`):

| Zasób | Nazwa | Szczegóły |
|---|---|---|
| VPC (custom mode) | `budget-vpc` | pula 10.0.0.0/16 |
| Podsieć publiczna (Web) | `budget-public-web` | 10.0.1.0/24 |
| Podsieć prywatna A (API) | `budget-private-api` | 10.0.2.0/24, Private Google Access |
| Podsieć prywatna B (DB) | `budget-private-db` | 10.0.3.0/24, Private Google Access |
| Firewall | `budget-vpc-allow-web-http-https` | 80/443 z 0.0.0.0/0 → tag `web` |
| Firewall | `budget-vpc-allow-api-from-web` | 8080 tylko z 10.0.1.0/24 → tag `api` |
| Firewall | `budget-vpc-allow-db-from-api` | 5432 tylko z 10.0.2.0/24 → tag `db` |
| Firewall | `budget-vpc-allow-ssh-iap` | 22 tylko z zakresu IAP 35.235.240.0/20 |
| Firewall | `budget-vpc-deny-all-ingress` | reszta ruchu przychodzącego blokowana (priorytet 65000, logowanie) |
| Cloud Router + Cloud NAT | `budget-vpc-router`, `budget-vpc-nat` | wyjście do Internetu tylko dla podsieci prywatnych |

Stan Terraform trzymany jest zdalnie w buckecie GCS (`prefix = blok03/network`).
Terraform działa przez konto serwisowe `terraform-network` (impersonacja), które ma w projekcie tylko role
`Compute Network Admin` (sieci, podsieci, router, NAT) i `Compute Security Admin` (reguły firewall)
oraz dostęp do samego bucketu ze stanem (zasada minimum uprawnień).

## Uruchomienie

```bash
export PROJECT_ID="twoj-project-id"
export GOOGLE_IMPERSONATE_SERVICE_ACCOUNT="terraform-network@${PROJECT_ID}.iam.gserviceaccount.com"

cd terraform
cp terraform.tfvars.example terraform.tfvars   # wpisz project_id
terraform init -backend-config="bucket=${PROJECT_ID}-tfstate"
terraform fmt -check
terraform validate
terraform plan -out=blok03.tfplan
terraform apply blok03.tfplan
terraform output
```
