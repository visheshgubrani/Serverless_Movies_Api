terraform {
  backend "s3" {
    bucket            = "terraformstatestoringbucket"
    key               = "terraform.tfstate"
    region            = "ap-south-1"
    encrypt           = true
    dynamodb_endpoint = "terraform-lock-table"
  }
}