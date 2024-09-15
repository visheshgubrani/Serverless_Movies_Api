variable "function_name" {}
variable "source_dir" {}
variable "output_path" {}
variable "handler" {}
variable "role_arn" {}
variable "lambda_runtime" {}
variable "set_environment" {
  description = "Set to true if environment variables should be configured"
  type        = bool
  default     = false
}

variable "environment_variables" {
  type        = map(string)
  default     = {}
}
