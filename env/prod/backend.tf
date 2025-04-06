terraform {
  backend "s3" {
    bucket         = "cloud-state-703671936667"
    key            = "terraform.tfstate"
    region         = "us-east-1"
    dynamodb_table = "terraform-lock-703671936667"
  }
}
