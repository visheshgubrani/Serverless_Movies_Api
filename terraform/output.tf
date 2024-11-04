output "certificate_validation_records" {
  value = module.cloudfront.certificate_validation_records
}

output "cloudfront_domain_name" {
  value = module.cloudfront.cloudfront_domain_name
}