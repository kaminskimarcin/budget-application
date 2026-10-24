output "vpc_id" {
  description = "ID sieci VPC"
  value       = google_compute_network.vpc.id
}

output "vpc_cidr" {
  description = "Pula adresowa sieci"
  value       = var.vpc_cidr
}

output "subnet_ids" {
  description = "ID utworzonych podsieci"
  value       = { for name, s in google_compute_subnetwork.subnet : name => s.id }
}

output "subnet_cidrs" {
  description = "Zakresy CIDR podsieci"
  value       = { for name, s in google_compute_subnetwork.subnet : name => s.ip_cidr_range }
}

output "nat_name" {
  description = "Nazwa bramy Cloud NAT"
  value       = google_compute_router_nat.nat.name
}
