locals {
  web_cidr = var.subnets["budget-public-web"].cidr
  api_cidr = var.subnets["budget-private-api"].cidr

  private_subnets = { for name, s in var.subnets : name => s if s.private }
}

resource "google_compute_network" "vpc" {
  name                    = var.network_name
  auto_create_subnetworks = false
  routing_mode            = "REGIONAL"
}

resource "google_compute_subnetwork" "subnet" {
  for_each = var.subnets

  name          = each.key
  ip_cidr_range = each.value.cidr
  region        = var.region
  network       = google_compute_network.vpc.id

  private_ip_google_access = each.value.private
}

resource "google_compute_firewall" "allow_web_http_https" {
  name          = "${var.network_name}-allow-web-http-https"
  network       = google_compute_network.vpc.id
  direction     = "INGRESS"
  priority      = 1000
  source_ranges = ["0.0.0.0/0"]
  target_tags   = ["web"]

  allow {
    protocol = "tcp"
    ports    = ["80", "443"]
  }
}

resource "google_compute_firewall" "allow_api_from_web" {
  name          = "${var.network_name}-allow-api-from-web"
  network       = google_compute_network.vpc.id
  direction     = "INGRESS"
  priority      = 1000
  source_ranges = [local.web_cidr]
  target_tags   = ["api"]

  allow {
    protocol = "tcp"
    ports    = [tostring(var.api_port)]
  }
}

resource "google_compute_firewall" "allow_db_from_api" {
  name          = "${var.network_name}-allow-db-from-api"
  network       = google_compute_network.vpc.id
  direction     = "INGRESS"
  priority      = 1000
  source_ranges = [local.api_cidr]
  target_tags   = ["db"]

  allow {
    protocol = "tcp"
    ports    = [tostring(var.db_port)]
  }
}

resource "google_compute_firewall" "allow_ssh_iap" {
  name          = "${var.network_name}-allow-ssh-iap"
  network       = google_compute_network.vpc.id
  direction     = "INGRESS"
  priority      = 1000
  source_ranges = ["35.235.240.0/20"]

  allow {
    protocol = "tcp"
    ports    = ["22"]
  }
}

resource "google_compute_firewall" "deny_all_ingress" {
  name          = "${var.network_name}-deny-all-ingress"
  network       = google_compute_network.vpc.id
  direction     = "INGRESS"
  priority      = 65000
  source_ranges = ["0.0.0.0/0"]

  deny {
    protocol = "all"
  }

  log_config {
    metadata = "EXCLUDE_ALL_METADATA"
  }
}

resource "google_compute_router" "router" {
  name    = "${var.network_name}-router"
  region  = var.region
  network = google_compute_network.vpc.id
}

resource "google_compute_router_nat" "nat" {
  name                               = "${var.network_name}-nat"
  router                             = google_compute_router.router.name
  region                             = var.region
  nat_ip_allocate_option             = "AUTO_ONLY"
  source_subnetwork_ip_ranges_to_nat = "LIST_OF_SUBNETWORKS"

  dynamic "subnetwork" {
    for_each = local.private_subnets
    content {
      name                    = google_compute_subnetwork.subnet[subnetwork.key].id
      source_ip_ranges_to_nat = ["ALL_IP_RANGES"]
    }
  }

  log_config {
    enable = true
    filter = "ERRORS_ONLY"
  }
}
