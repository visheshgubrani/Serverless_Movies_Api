myregion                 = "ap-south-1"
dynamo_db_table_name     = "movies"
dynamo_db_read_capacity  = "1"
dynamo_db_write_capacity = "1"
dynamo_db_hash_key       = "id"
dynamo_db_billing_mode   = "PROVISIONED"

# s3 Bucket
cover_images_s3_bucket_name = "ltc-moviecovers-storage"

# Lambda IAM Policy
lambda_basic_policy         = "arn:aws:iam::aws:policy/service-role/AWSLambdaBasicExecutionRole"
lambda_dynamodb_read_policy = "arn:aws:iam::aws:policy/AmazonDynamoDBReadOnlyAccess"
role_name                   = "iam_policy_for_lambda"

# Cloudfront
root_domain = "moviesapi.xyz"
domain_aliases = ["moviesapi.xyz", "*.moviesapi.xyz"]
certificate_sans = ["*.moviesapi.xyz"]
static_site_bucket_name = "www.moviesapi.xyz"

# api_key and accountId will be handled securely via environment variables
