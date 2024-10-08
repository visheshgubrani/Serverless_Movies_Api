terraform {
  backend "s3" {
    bucket            = var.backend_bucket_name
    key               = "terraform.tfstate"
    region            = var.myregion
    encrypt           = true
    dynamodb_endpoint = var.backen_dynamo_db_endpoint
  }
}