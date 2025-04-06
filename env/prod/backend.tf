terraform {
  backend "s3" {
    bucket         = "cloud-state-968945269517"
    key            = "terraform.tfstate"
    region         = "us-east-1"
    dynamodb_table = "terraform-lock-968945269517"
    profile        = "prod"
  }
}
