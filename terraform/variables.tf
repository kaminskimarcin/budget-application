variable "project_id" {
  description = "ID projektu GCP"
  type        = string
}

variable "region" {
  description = "Region GCP (Warszawa)"
  type        = string
  default     = "europe-central2"
}

variable "network_name" {
  description = "Nazwa sieci VPC"
  type        = string
  default     = "budget-vpc"
}

variable "vpc_cidr" {
  description = "Pula adresowa całej sieci (GCP nie przypisuje CIDR do VPC, pula służy do planowania podsieci i reguł firewall)"
  type        = string
  default     = "10.0.0.0/16"
}

variable "subnets" {
  description = "Podsieci 3-tier: public web, private app (API), private db"
  type = map(object({
    cidr    = string
    private = bool
  }))
  default = {
    "budget-public-web"  = { cidr = "10.0.1.0/24", private = false }
    "budget-private-api" = { cidr = "10.0.2.0/24", private = true }
    "budget-private-db"  = { cidr = "10.0.3.0/24", private = true }
  }
}

variable "api_port" {
  description = "Port backendu Spring Boot"
  type        = number
  default     = 8080
}

variable "db_port" {
  description = "Port PostgreSQL"
  type        = number
  default     = 5432
}
