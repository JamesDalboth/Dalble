resource "aws_cloudfront_function" "viewer_request" {
  name    = "dalble-cdn-viewer-request"
  runtime = "cloudfront-js-1.0"
  publish = true
  code    = file("${path.module}/viewer-request.js")
}

module "website" {
  source = "terraform-aws-modules/cloudfront/aws"

  aliases = ["${var.product}.${var.domain}"]

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

    function_association = {
      viewer-request = {
        function_arn = aws_cloudfront_function.viewer_request.arn
      }
    }
  }

  viewer_certificate = {
    acm_certificate_arn = aws_acm_certificate.cert.arn
    ssl_support_method  = "sni-only"
  }

  default_root_object = "index.html"

  depends_on = [aws_acm_certificate.cert, aws_route53_record.cert_validation]
}
