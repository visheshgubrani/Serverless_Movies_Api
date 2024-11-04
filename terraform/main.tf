# DynamoDB Table
module "dynamo_db_table" {
  source                   = "./modules/dynamodb"
  dynamo_db_table_name     = var.dynamo_db_table_name
  dynamo_db_billing_mode   = var.dynamo_db_billing_mode
  dynamo_db_hash_key       = var.dynamo_db_hash_key
  dynamo_db_read_capacity  = var.dynamo_db_read_capacity
  dynamo_db_write_capacity = var.dynamo_db_write_capacity
}

# S3 Bucket
module "s3_bucket" {
  source                      = "./modules/s3"
  cover_images_s3_bucket_name = var.cover_images_s3_bucket_name
}

# Lambda IAM Policy
module "lambda_iam_policy" {
  source                      = "./modules/iam"
  lambda_basic_policy         = var.lambda_basic_policy
  lambda_dynamodb_read_policy = var.lambda_dynamodb_read_policy
  role_name                   = var.role_name
}

# Lambda Function Get Movies
module "lambda_get_movies" {
  source         = "./modules/lambda"
  function_name  = "getMovies"
  handler        = "index.handler"
  source_dir     = "${path.module}/modules/lambda/getMovies"
  output_path    = "${path.module}/modules/lambda/getMovies/get-movies.zip"
  lambda_runtime = "nodejs20.x"
  role_arn       = module.lambda_iam_policy.lambda_role_arn
  timeout        = 3

  set_environment = false
}

# Lambda Function Get Movies By year
module "lambda_get_movies_by_year" {
  source         = "./modules/lambda"
  function_name  = "getMoviesByYear"
  handler        = "index.handler"
  source_dir     = "${path.module}/modules/lambda/getMoviesByYear"
  output_path    = "${path.module}/modules/lambda/getMoviesByYear/get-movies_by_year.zip"
  lambda_runtime = "nodejs20.x"
  role_arn       = module.lambda_iam_policy.lambda_role_arn
  timeout        = 3

  set_environment = false
}

# Generate Movie Summary
module "lambda_generate_movie_summary" {
  source         = "./modules/lambda"
  function_name  = "generateMovieSummary"
  handler        = "index.handler"
  source_dir     = "${path.module}/modules/lambda/aiGeneratedSummary"
  output_path    = "${path.module}/modules/lambda/aiGeneratedSummary/ai_generated_summary.zip"
  lambda_runtime = "nodejs20.x"
  role_arn       = module.lambda_iam_policy.lambda_role_arn
  timeout        = 10

  set_environment = true
  environment_variables = {
    API_KEY = var.api_key
  }
}

module "api_gateway" {
  source                         = "./modules/apigateway"
  apigw_name                     = "moviesapi"
  myregion                       = var.myregion
  uri_get_movies                 = module.lambda_get_movies.get_movies_arn
  uri_by_year                    = module.lambda_get_movies_by_year.get_movies_by_year_arn
  uri_generate_summary           = module.lambda_generate_movie_summary.summary_arn
  function_name_by_year          = module.lambda_get_movies_by_year.getmoviesbyyear
  function_name_generate_summary = module.lambda_generate_movie_summary.generatemoviesummary
  function_name_get_movies       = module.lambda_get_movies.get_movies
  accountId                      = var.accountId

}

module "cors_integration_getmovies" {
  source      = "./modules/cors"
  resource_id = module.api_gateway.get_movies_resource_id
  rest_api_id = module.api_gateway.rest_api_id
  methods     = ["GET", "OPTIONS"]
}

module "cors_integration_getmoviesbyyear" {
  source      = "./modules/cors"
  resource_id = module.api_gateway.get_movies_by_year_resource_id
  rest_api_id = module.api_gateway.rest_api_id
  methods     = ["GET", "OPTIONS"]
}

module "cors_integration_generatesummary" {
  source      = "./modules/cors"
  resource_id = module.api_gateway.aws_generate_movie_summary_id
  rest_api_id = module.api_gateway.rest_api_id
  methods     = ["GET", "OPTIONS"]
}

module "cloudfront" {
  source = "./modules/cloudfront"
  providers = {
    aws.us-east-1 = aws.us_east_1
  }
  static_site_bucket_name = var.static_site_bucket_name
  root_domain             = var.root_domain
  domain_aliases          = var.domain_aliases
  certificate_sans        = var.certificate_sans
}