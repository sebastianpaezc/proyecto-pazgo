resource "aws_instance" "juanito" {
  ami                    = var.ami_id
  instance_type          = var.tipo_instancia
  vpc_security_group_ids = ["sg-0eaae6b3e421e56b4"]
  subnet_id              = var.subnet_id

  tags = {
    Name = var.nombre_instancia
    #Environment = var.entorno
  }
}

resource "aws_instance" "jorge" {
  ami                    = var.ami_id
  instance_type          = var.tipo_instancia
  vpc_security_group_ids = ["sg-0eaae6b3e421e56b4"]
  subnet_id              = var.subnet_id

  tags = {
    Name    = "Jorge Paez"
    Entorno = var.entorno
  }
}

