module "s3_bucket" {
  source = "terraform-aws-modules/s3-bucket/aws"

  bucket = "dalble"
  acl    = "private"

  control_object_ownership = true
  object_ownership         = "BucketOwnerPreferred"

  versioning = {
    enabled = true
  }
}

data "aws_iam_policy_document" "s3_policy" {
  version = "2012-10-17"
  statement {
    actions   = ["s3:GetObject"]
    resources = ["${module.s3_bucket.s3_bucket_arn}/*"]
    principals {
      type        = "AWS"
      identifiers = module.website.cloudfront_origin_access_identity_iam_arns
    }
  }
}

resource "aws_s3_bucket_policy" "docs" {
  bucket = module.s3_bucket.s3_bucket_id
  policy = data.aws_iam_policy_document.s3_policy.json
}

module "s3_build_folder" {
  source = "chandan-singh/s3-object-folder/aws"

  bucket                = module.s3_bucket.s3_bucket_id
  base_folder_path      = var.src_folder
  source_prefix         = var.src_folder
  file_glob_pattern     = "**"
  set_auto_content_type = true

  path_prefix = {
    remove = ""
    add    = "build/"
  }
}
