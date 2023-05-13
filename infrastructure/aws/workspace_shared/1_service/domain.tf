resource "aws_lightsail_certificate" "certificate" {
  name                      = "dalble"
  domain_name               = "dalboth.com"
  subject_alternative_names = ["dalble.dalboth.com"]

  tags = {
    env     = var.env
    region  = var.region
    product = var.product
  }
}

resource "aws_lightsail_domain" "domain" {
  domain_name = "dalboth.com"
}

resource "aws_lightsail_domain_entry" "domain_entry" {
  domain_name = aws_lightsail_domain.domain.domain_name
  name        = "dalble"
  type        = "CNAME"
  target      = replace(replace(aws_lightsail_container_service.container_service.url, "https://", ""), "/", "")
}
