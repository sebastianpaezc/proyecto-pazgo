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
  region  = var.region
  profile = "dev"
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
