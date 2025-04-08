terraform {
  backend "s3" {
    bucket         = "cloud-state-442697343828"
    key            = "terraform.tfstate"
    region         = "us-east-1"
    dynamodb_table = "terraform-lock-442697343828"
    profile        = "qa"
  }
}
