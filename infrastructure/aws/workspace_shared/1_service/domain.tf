module "zones" {
  source  = "terraform-aws-modules/route53/aws//modules/zones"
  version = "~> 2.0"

  zones = {
    "dalboth.com" = {
      comment = "dalboth.com"
      tags = {
        env     = var.env
        region  = var.region
        product = var.product
      }
    }
  }

  tags = {
    env     = var.env
    region  = var.region
    product = var.product
  }
}

resource "aws_acm_certificate" "cert" {
  domain_name       = "${var.product}.dalboth.com"
  validation_method = "DNS"

  tags = {
    env     = var.env
    region  = var.region
    product = var.product
  }

  lifecycle {
    create_before_destroy = true
  }
}

module "records" {
  source  = "terraform-aws-modules/route53/aws//modules/records"
  version = "~> 2.0"

  zone_name = module.zones.route53_zone_name["dalboth.com"]

  records = concat([
    {
      name = var.product
      type = "A"
      alias = {
        name    = module.website.cloudfront_distribution_domain_name
        zone_id = module.website.cloudfront_distribution_hosted_zone_id
      }
    }
    ], [for dvo in aws_acm_certificate.cert.domain_validation_options :
    {
      name               = dvo.resource_record_name
      type               = dvo.resource_record_type
      ttl                = 60
      full_name_override = true
      records            = [dvo.resource_record_value]
    }
  ])

  depends_on = [module.zones]
}
