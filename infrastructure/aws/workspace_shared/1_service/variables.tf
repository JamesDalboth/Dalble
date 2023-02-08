variable "env" {
  description = "Application stack identifier"
  validation {
    condition     = can(regex("^dev|int|pft|sbx|prd", var.env))
    error_message = "Expects env to be one of {dev, int, pft, sbx, prd}."
  }
  type = string
}

variable "product" {
  description = "The product group this component belongs to"
  type        = string
  default     = "dalble"
}

variable "region" {
  description = "The aws regions where the resources will be created"
  type        = string
}

variable "profile" {
  description = "The AWS account name"
}
