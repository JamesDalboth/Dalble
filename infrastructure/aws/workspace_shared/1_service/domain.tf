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

module "records" {
  source  = "terraform-aws-modules/route53/aws//modules/records"
  version = "~> 2.0"

  zone_name = module.zones.route53_zone_name["dalboth.com"]

  records = [
    {
      name = "dalble"
      type = "A"
      alias = {
        name    = module.website.cloudfront_distribution_domain_name
        zone_id = module.website.cloudfront_distribution_hosted_zone_id
      }
    }
  ]

  depends_on = [module.zones]
}
