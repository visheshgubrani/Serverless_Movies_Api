variable "rest_api_id" {}
variable "resource_id" {}
variable "methods" {
  type = list(string)
  default = [ "GET", "OPTIONS" ]
}


