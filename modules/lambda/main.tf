data "archive_file" "lambda_package" {
  type = "zip"
  source_dir = "${var.source_dir}"
  output_path = "${var.output_path}"
}

resource "aws_lambda_function" "lambda_function" {
  filename = data.archive_file.lambda_package.output_path 
  function_name = var.function_name
  role = var.role_arn
  handler = var.handler 
  runtime = var.lambda_runtime
  timeout = var.timeout
  source_code_hash = data.archive_file.lambda_package.output_base64sha256

  dynamic "environment" {
    for_each = var.set_environment ? [1] : []
    content {
      variables = var.environment_variables
    }
  }
}