terraform {
  backend "s3" {
    bucket         = "cloud-state-353388155646"
    key            = "terraform.tfstate"
    region         = "us-east-1"
    dynamodb_table = "terraform-lock-353388155646"
    profile        = "demo"
  }
}
