resource "aws_route53_record" "dalble" {
  name    = var.product
  type    = "A"
  zone_id = data.aws_route53_zone.dalble.id
  alias {
    name                   = module.website.cloudfront_distribution_domain_name
    zone_id                = module.website.cloudfront_distribution_hosted_zone_id
    evaluate_target_health = true
  }
}

locals {
  sans = ["${var.product}.${var.domain}"]
}

resource "aws_acm_certificate" "cert" {
  domain_name       = var.domain
  validation_method = "DNS"

  subject_alternative_names = local.sans

  tags = {
    env     = var.env
    region  = var.region
    product = var.product
  }

  lifecycle {
    create_before_destroy = true
  }
}

locals {
  dvos = tolist(aws_acm_certificate.cert.domain_validation_options)
}

resource "aws_route53_record" "cert_validation" {
  count = length(local.sans) + 1

  name    = local.dvos[count.index].resource_record_name
  type    = local.dvos[count.index].resource_record_type
  zone_id = data.aws_route53_zone.dalble.id
  records = [local.dvos[count.index].resource_record_value]
  ttl     = 60
}

resource "aws_acm_certificate_validation" "cert" {
  certificate_arn         = aws_acm_certificate.cert.arn
  validation_record_fqdns = aws_route53_record.cert_validation[*].fqdn
}
