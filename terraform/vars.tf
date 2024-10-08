variable "myregion" {}

# DynamoDb
variable "dynamo_db_read_capacity" {}
variable "dynamo_db_write_capacity" {}
variable "dynamo_db_hash_key" {}
variable "dynamo_db_billing_mode" {}
variable "dynamo_db_table_name" {
  default = "movies"
}
# s3 Bucket
variable "s3_bucket_name" {}

# Lambda IAM Policy
variable "lambda_basic_policy" {}
variable "lambda_dynamodb_read_policy" {}
variable "role_name" {}

variable "api_key" {}
variable "accountId" {}
variable "backend_bucket_name" {}
variable "backen_dynamo_db_endpoint" {}