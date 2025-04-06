resource "aws_instance" "juanito" {
  ami                    = var.ami_id
  instance_type          = var.tipo_instancia
  vpc_security_group_ids = length(var.vpc_security_group_ids) > 0 ? var.vpc_security_group_ids : [data.aws_security_group.default.id]
  subnet_id              = var.subnet_id

  tags = {
    Name = var.nombre_instancia
    #Environment = var.entorno
  }
}

resource "aws_instance" "jorge" {
  ami                    = var.ami_id
  instance_type          = var.tipo_instancia
  vpc_security_group_ids = length(var.vpc_security_group_ids) > 0 ? var.vpc_security_group_ids : [data.aws_security_group.default.id]
  subnet_id              = var.subnet_id

  tags = {
    Name    = "Jorge Paez"
    Entorno = var.entorno
  }
}

resource "aws_instance" "jorge1" {
  ami                    = var.ami_id
  instance_type          = var.tipo_instancia
  vpc_security_group_ids = length(var.vpc_security_group_ids) > 0 ? var.vpc_security_group_ids : [data.aws_security_group.default.id]
  subnet_id              = var.subnet_id

  tags = {
    Name    = "Juanito Paez"
    Entorno = var.entorno
  }
}

