output "get_movies_arn" {
  value = aws_lambda_function.lambda_function.invoke_arn
}

output "get_movies" {
  value = aws_lambda_function.lambda_function.function_name
}

output "get_movies_by_year_arn" {
  value = aws_lambda_function.lambda_function.invoke_arn
}

output "getmoviesbyyear" {
  value = aws_lambda_function.lambda_function.function_name
}

output "summary_arn" {
  value = aws_lambda_function.lambda_function.invoke_arn
}

output "generatemoviesummaryr" {
  value = aws_lambda_function.lambda_function.function_name
}