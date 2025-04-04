terraform {
  required_version = "~> 1.11.0"
  required_providers {
    aws = {
      source  = "hashicorp/aws"
      version = "~> 5.0"
    }
  }
}
provider "aws" {
  region = var.region
  assume_role {
    role_arn     = var.assume_role_arn
    external_id  = var.assume_role_exteral_id
    session_name = "terraform"
  }
  default_tags {
    tags = {
      Environment = var.entorno
      Proyect     = "Pazgo"
      AppId       = "123"
    }
  }
}




/*
resource "aws_s3_bucket" "terraform_state" {
  bucket = "cloud-state-703671936667"

  lifecycle {
    prevent_destroy = true
  }
}

resource "aws_s3_bucket_versioning" "enabled" {
  bucket = aws_s3_bucket.terraform_state.id
  versioning_configuration {
    status = "Enabled"
  }
}

resource "aws_dynamodb_table" "terraform_locks" {
  name         = "terraform-lock-703671936667"
  billing_mode = "PAY_PER_REQUEST"
  hash_key     = "LockID"

  attribute {
    name = "LockID"
    type = "S"
  }
<<<<<<< HEAD
}*/
