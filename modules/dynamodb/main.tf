resource "aws_dynamodb_table" "movies-table" {
  name           = var.dynamo_db_table_name
  billing_mode   = var.dynamo_db_billing_mode
  read_capacity  = var.dynamo_db_read_capacity
  write_capacity = var.dynamo_db_write_capacity
  hash_key       = var.dynamo_db_hash_key

  attribute {
    name = "id"
    type = "S"
  }

  attribute {
    name = "releaseYear"
    type = "S"
  }

  attribute {
    name = "title"
    type = "S"
  }

  global_secondary_index {
    name            = "releaseYear-index"
    hash_key        = "releaseYear"
    projection_type = "ALL"
    read_capacity   = 5
    write_capacity  = 5
  }

  global_secondary_index {
    name            = "title-index"
    hash_key        = "title"
    projection_type = "ALL"
    read_capacity   = 5
    write_capacity  = 5
  }

  tags = {
    Name        = var.dynamo_db_table_name
    Environment = "dev"
  }
}