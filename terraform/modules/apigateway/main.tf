resource "aws_api_gateway_rest_api" "movies_api" {
  name = var.apigw_name
}

resource "aws_api_gateway_resource" "get_movies" {
  rest_api_id = aws_api_gateway_rest_api.movies_api.id
  parent_id = aws_api_gateway_rest_api.movies_api.root_resource_id
  path_part = "getmovies"
}

resource "aws_api_gateway_method" "get_movies" {
  rest_api_id   = aws_api_gateway_rest_api.movies_api.id
  resource_id   = aws_api_gateway_resource.get_movies.id
  http_method = "GET"
  authorization = "NONE"
}

resource "aws_api_gateway_integration" "get_movies" {
  rest_api_id   = aws_api_gateway_rest_api.movies_api.id
  resource_id   = aws_api_gateway_resource.get_movies.id
  http_method = aws_api_gateway_method.get_movies.http_method
  type = "AWS_PROXY"
  integration_http_method = "POST"
  uri = var.uri_get_movies
}

resource "aws_api_gateway_resource" "get_movies_by_year" {
  rest_api_id = aws_api_gateway_rest_api.movies_api.id
  parent_id   = aws_api_gateway_rest_api.movies_api.root_resource_id
  path_part   = "getmoviesbyyear"
}

resource "aws_api_gateway_resource" "year" {
  rest_api_id = aws_api_gateway_rest_api.movies_api.id
  parent_id   = aws_api_gateway_resource.get_movies_by_year.id
  path_part   = "{year}" # Placeholder for year
}

resource "aws_api_gateway_method" "get_movies_by_year" {
  rest_api_id   = aws_api_gateway_rest_api.movies_api.id
  resource_id   = aws_api_gateway_resource.year.id
  http_method   = "GET"
  authorization = "NONE"
}

resource "aws_api_gateway_integration" "get_movies_by_year" {
  rest_api_id             = aws_api_gateway_rest_api.movies_api.id
  resource_id             = aws_api_gateway_resource.year.id
  http_method             = aws_api_gateway_method.get_movies_by_year.http_method
  type                    = "AWS_PROXY"
  integration_http_method = "POST"
  uri                     = var.uri_by_year # Define a new URI variable for this Lambda function
}

resource "aws_api_gateway_resource" "generate_movie_summary" {
  rest_api_id = aws_api_gateway_rest_api.movies_api.id
  parent_id   = aws_api_gateway_rest_api.movies_api.root_resource_id
  path_part   = "generatemoviesummary"
}

resource "aws_api_gateway_resource" "movie_name" {
  rest_api_id = aws_api_gateway_rest_api.movies_api.id
  parent_id   = aws_api_gateway_resource.generate_movie_summary.id
  path_part   = "{movieName}" # Placeholder for movie name
}

resource "aws_api_gateway_method" "generate_movie_summary" {
  rest_api_id   = aws_api_gateway_rest_api.movies_api.id
  resource_id   = aws_api_gateway_resource.movie_name.id
  http_method   = "GET"
  authorization = "NONE"
}

resource "aws_api_gateway_integration" "generate_movie_summary" {
  rest_api_id             = aws_api_gateway_rest_api.movies_api.id
  resource_id             = aws_api_gateway_resource.movie_name.id
  http_method             = aws_api_gateway_method.generate_movie_summary.http_method
  type                    = "AWS_PROXY"
  integration_http_method = "POST"
  uri                     = var.uri_generate_summary # New URI for the Lambda that generates movie summaries
}

resource "aws_lambda_permission" "apigw_lambda" {
  statement_id  = "AllowExecutionFromAPIGateway"
  action        = "lambda:InvokeFunction"
  function_name = var.function_name_get_movies # name, pass as variable
  principal     = "apigateway.amazonaws.com"

  # More: http://docs.aws.amazon.com/apigateway/latest/developerguide/api-gateway-control-access-using-iam-policies-to-invoke-api.html
  source_arn = "arn:aws:execute-api:${var.myregion}:${var.accountId}:${aws_api_gateway_rest_api.movies_api.id}/*/${aws_api_gateway_method.get_movies.http_method}${aws_api_gateway_resource.get_movies.path}"
}

resource "aws_lambda_permission" "apigw_lambda_summary" {
  statement_id  = "AllowExecutionFromAPIGatewayForSummary"
  action        = "lambda:InvokeFunction"
  function_name = var.function_name_generate_summary # Lambda function for generating summaries
  principal     = "apigateway.amazonaws.com"
  source_arn    = "arn:aws:execute-api:${var.myregion}:${var.accountId}:${aws_api_gateway_rest_api.movies_api.id}/*/${aws_api_gateway_method.generate_movie_summary.http_method}${aws_api_gateway_resource.movie_name.path}"
}


resource "aws_lambda_permission" "apigw_lambda_year" {
  statement_id  = "AllowExecutionFromAPIGatewayForYear"
  action        = "lambda:InvokeFunction"
  function_name = var.function_name_by_year # Lambda function to handle requests
  principal     = "apigateway.amazonaws.com"
  source_arn    = "arn:aws:execute-api:${var.myregion}:${var.accountId}:${aws_api_gateway_rest_api.movies_api.id}/*/${aws_api_gateway_method.get_movies_by_year.http_method}${aws_api_gateway_resource.year.path}"
}

resource "aws_api_gateway_deployment" "deployment" {
  depends_on = [ 
    aws_api_gateway_integration.get_movies, 
    aws_api_gateway_integration.get_movies_by_year,
    aws_api_gateway_integration.generate_movie_summary
    ]
  rest_api_id = aws_api_gateway_rest_api.movies_api.id
  stage_name = "v1"

  lifecycle {
    create_before_destroy = true
  }
}
