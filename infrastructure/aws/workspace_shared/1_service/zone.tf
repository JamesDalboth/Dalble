resource "aws_route53_zone" "zone" {
  name = var.domain
}

data "aws_route53_zone" "dalble" {
  zone_id = aws_route53_zone.zone.id
}
