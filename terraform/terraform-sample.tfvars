myregion                 = "ap-south-1"
dynamo_db_table_name     = "movies"
dynamo_db_read_capacity  = "1"
dynamo_db_write_capacity = "1"
dynamo_db_hash_key       = "id"
dynamo_db_billing_mode   = "PROVISIONED"

# s3 Bucket
s3_bucket_name = "ltgmoviessbucket"

# Lambda IAM Policy
lambda_basic_policy         = "arn:aws:iam::aws:policy/service-role/AWSLambdaBasicExecutionRole"
lambda_dynamodb_read_policy = "arn:aws:iam::aws:policy/AmazonDynamoDBReadOnlyAccess"
role_name                   = "iam_policy_for_lambda"

api_key   = "AIzaSyCKUxugY1rU8bY3CvivCG2sK7tGxvRQDrY"
accountId = "533267410454"
backend_bucket_name = "terraformstatestoringbucket"
backen_dynamo_db_endpoint = "terraform-lock-table"