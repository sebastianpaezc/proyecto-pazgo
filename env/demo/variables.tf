variable "region" {
  type        = string
  description = "aws region us-east-1"
}
variable "assume_role_arn" {
  type        = string
  description = "Arn del rol de terraform"
}

variable "assume_role_exteral_id" {
  type        = string
  description = "Id external del rol"
}

variable "tipo_instancia" {
  type        = string
  description = "Tipo de la istancia EC2"
}

variable "ami_id" {
  type        = string
  description = "Identificador de la Ami"
}

variable "entorno" {
  type        = string
  description = "Entorno en el que estamos trabajando"
}

variable "nombre_instancia" {
  type        = string
  description = "nombre de la instancia"
  default     = "un_raton"

}

variable "vpc_security_group_ids" {
  type        = list(string)
  description = "Lista de IDs de grupos de seguridad"
  default     = []
}

variable "subnet_id" {
  type        = any
  description = "Id external del rol"
  default     = ""
}

variable "session_name" {
  type        = string
  description = "hay que poner terraform"
}

variable "proyect" {
  type        = string
  description = "nombre del proyecto"
}

variable "AppId" {
  type        = string
  description = "este seria el id del proyecto"
}
