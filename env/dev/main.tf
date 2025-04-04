resource "aws_instance" "juanito" {
  ami                    = var.ami_id
  instance_type          = var.tipo_instancia
  vpc_security_group_ids = var.vpc_security_group_ids
  subnet_id              = var.subnet_id

  tags = {
    Name = var.nombre_instancia
    #Environment = var.entorno
  }
}

