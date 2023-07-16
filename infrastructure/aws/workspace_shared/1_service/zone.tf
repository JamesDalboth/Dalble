resource "aws_route53_zone" "zone" {
  name = var.domain
}

data "aws_route53_zone" "zone_data" {
  zone_id = aws_route53_zone.zone.id
}
