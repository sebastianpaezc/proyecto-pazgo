variable "region" {
  type        = string
  description = "aws region us-east-1"
  default     = "us-east-1"
}
variable "assume_role_arn" {
  type        = string
  description = "Arn del rol de terraform"
  default     = "arn:aws:iam::703671936667:role/terraform_v1"
}
variable "assume_role_exteral_id" {
  type        = string
  description = "Id external del rol"
  default     = "terraform-external-id"
}
variable "tipo_instancia" {
  description = "Tipo de la istancia EC2"
  type        = string
  default     = "t2.micro"
}

variable "ami_id" {
  description = "Identificador de la Ami"
  type        = string
  default     = "ami-01816d07b1128cd2d"
}

variable "entorno" {
  description = "Entorno en el que estamos trabajando"
  type        = string
  default     = ""
}

variable "nombre_instancia" {
  description = "nombre de la instancia"
  type        = string
  default     = "un_raton"

}

variable "vpc_security_group_ids" {
  type        = any
  description = "Id external del rol"
  default     = []
}

variable "subnet_id" {
  type        = any
  description = "Id external del rol"
  default     = ""
}
