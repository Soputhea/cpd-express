terraform {
  required_providers {
    digitalocean = {
      source  = "digitalocean/digitalocean"
      version = "~> 2.0"
    }
  }
}

# Set the variable value in *.tfvars file
# or using -var="do_token=..." CLI option
variable "do_token" {}

# Configure the DigitalOcean Provider
provider "digitalocean" {
  token = var.do_token
}

# Create a new SSH key
resource "digitalocean_ssh_key" "project_2_key" {
  name       = "project_2_key"
  public_key = "ssh-rsa AAAAB3NzaC1yc2EAAAADAQABAAACAQCWd+7SMJTyRgrHptYgq5PCfNZEdGWy1Ps7W4IVrS7Yp5QFaYv4AcbZIsqDnFiO/eGKg11RVBrCS2KaHNqWWFH3E4Jlpo5EbhWC56Vt6kXzmgGgpYOWJvUbq9jnJUKT/8u6bH/1SePkIzEQa5MoIquD0m28wBTZNl+CtYAlGpEERiYT1CrP8ha7nWbgetThng0GKvbTM0Gj9HQXLfTXbbyJPrQzc6S0cFi1LzMG718C126AAXIT4ud3/+bYmA5n2e00N3diN7QsAsKKTuM991EGHjuvxKDiLZfe1/emXR2dpS24QIKwq3zV3XflGvPNMd/T4bgzROt1ntL9UegqWUFdAb0mjygE2FRRFLk78huyBUi6xugZQDP5azvCQbEGdE8J/b4nX4blguwjNUbkkGQmvPf0gGLGtGG0Jf7hnGtPa/4DW3Kaq1aNtdBETHzESpwtT30ReWI1Xz0Nc8EL1aANjHLVulcVAPA0+EcA3t81Ik0QyWheNaGF9zj0UUEZx+UsndPZnmXplUrqRyfIm4A5ohycNTrf/BxKWUxmYnyR9uP9uLKpSkxlNBOi3/dTXJe92E3tz0oCcdK2qMyaTM+gG9fAu5g9qpUR4bi8bLgpn6qNZG9nxIzeEW26fd0V6RgqXyNoDPGn5LndEBTva4PXZ2j1XXWN2Q51NQMvQPeoZQ== lysoputhea007@gmail.com"
}

# Create a new Web Droplet in the nyc2 region
resource "digitalocean_droplet" "project_2" {
  image  = "ubuntu-22-04-x64"
  name   = "project-2"
  region = "sgp1"
  size   = "s-1vcpu-1gb"
  ssh_keys = [digitalocean_ssh_key.project_2_key.fingerprint]
}

output p2_host {
  value       = digitalocean_droplet.project_2.ipv4_address
  description = "IPV4 of P2 Droplet"
}
