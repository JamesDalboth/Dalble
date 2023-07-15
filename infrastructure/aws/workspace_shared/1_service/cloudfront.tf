module "website" {
  source = "terraform-aws-modules/cloudfront/aws"

  comment             = "Dalble website"
  is_ipv6_enabled     = true
  price_class         = "PriceClass_200"
  wait_for_deployment = false

  create_origin_access_identity = true
  origin_access_identities = {
    s3 = "Access to dalble s3 bucket"
  }
  origin = {
    s3 = {
      domain_name = module.s3_bucket.s3_bucket_bucket_regional_domain_name
      origin_path = "/${var.s3_folder}"
      s3_origin_config = {
        origin_access_identity = "s3"
      }
    }
  }

  default_cache_behavior = {
    target_origin_id       = "s3"
    viewer_protocol_policy = "redirect-to-https"

    default_ttl = 5400
    min_ttl     = 3600
    max_ttl     = 7200

    allowed_methods = ["GET", "HEAD"]
    cached_methods  = ["GET", "HEAD"]
    compress        = true
    query_string    = false
  }

  default_root_object = "index.html"
}
