resource "aws_lightsail_certificate" "certificate" {
  name                      = "dalble"
  domain_name               = "dalboth.com"
  subject_alternative_names = ["dalble.dalboth.com"]

  tags = {
    env = var.env
    region = var.region
    product = var.product
  }
}

resource "aws_lightsail_container_service" "container_service" {
  depends_on = [aws_lightsail_certificate.certificate]
  name        = "${var.env}-${var.region}-${var.product}-lightsail-container-service"
  power       = "micro"
  scale       = 1
  is_disabled = false

  public_domain_names {
    certificate {
      certificate_name = "dalble"
      domain_names = [
        "dalble.dalboth.com"
      ]
    }
  }

  tags = {
    env = var.env
    region = var.region
    product = var.product
  }
}

resource "aws_lightsail_container_service_deployment_version" "deployment" {
  container {
    container_name = "service"
    image          = "jamesdalboth/dalble:0.3.0"

    ports = {
      80 = "HTTP"
    }
  }

  public_endpoint {
    container_name = "service"
    container_port = 80

    health_check {
      healthy_threshold   = 2
      unhealthy_threshold = 10
      timeout_seconds     = 2
      interval_seconds    = 5
      path                = "/"
      success_codes       = "200-499"
    }
  }

  service_name = aws_lightsail_container_service.container_service.name
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

