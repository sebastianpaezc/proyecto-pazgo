data "aws_security_group" "default" {
  filter {
    name   = "group-name"
    values = ["default"]
  }
}
