output "rest_api_id" {
  value = aws_api_gateway_rest_api.movies_api.id
}

output "get_movies_resource_id" {
  value = aws_api_gateway_resource.get_movies.id
}

output "get_movies_by_year_resource_id" {
  value = aws_api_gateway_resource.year.id
}

output "aws_generate_movie_summary_id" {
  value = aws_api_gateway_resource.movie_name.id
}

output "invoke_url" {
  value = aws_api_gateway_deployment.deployment.invoke_url
}