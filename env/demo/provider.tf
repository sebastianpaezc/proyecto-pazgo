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
    session_name = var.session_name
  }
  default_tags {
    tags = {
      Environment = var.entorno
      Proyect     = var.proyect
      AppId       = var.AppId
    }
  }
}
/*
resource "aws_s3_bucket" "terraform_state" {
   bucket = "cloud-state-353388155646"
 
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
   name         = "terraform-lock-353388155646"
   billing_mode = "PAY_PER_REQUEST"
   hash_key     = "LockID"
 
   attribute {
     name = "LockID"
     type = "S"
   }
 }*/