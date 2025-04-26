resource "aws_instance" "juanito" {
  ami                    = var.ami_id
  instance_type          = var.tipo_instancia
  vpc_security_group_ids = length(var.vpc_security_group_ids) > 0 ? var.vpc_security_group_ids : [data.aws_security_group.default.id]
  subnet_id              = var.subnet_id

  tags = {
    Name = var.nombre_instancia
  }
}

resource "aws_instance" "Pazgo" {
  ami                         = "ami-01816d07b1128cd2d"
  instance_type               = "t2.micro"
  vpc_security_group_ids      = [aws_security_group.name.id]
  subnet_id                   = data.aws_subnet.zd_1s.id
  associate_public_ip_address = true

  user_data = <<-EOF
    #!/bin/bash
    apt-get update -y
    apt-get install -y nginx
    systemctl enable nginx
    systemctl start nginx
    # Crear el archivo index.html en la ubicación correcta
    echo "Hello World desde Nginx en Terraform jajajaja estamos Arriba muchachos jejeje," | tee /usr/share/nginx/html/index.html
    # Asegurar que el archivo tenga los permisos adecuados
    chown nginx:nginx /usr/share/nginx/html/index.html
    chmod 644 /usr/share/nginx/html/index.html
  EOF

  tags = {
    Name = "Login"
  }
}

resource "aws_security_group" "name" {
  name        = "sg_pazgo"
  description = "grupo de seguridad instancia"
  vpc_id      = data.aws_vpc.vpc_default.id
}
resource "aws_security_group_rule" "regla_uno" {

  type              = "ingress"
  from_port         = 0
  to_port           = 0
  protocol          = -1
  description       = "regla_entrada"
  security_group_id = aws_security_group.name.id
  cidr_blocks       = ["0.0.0.0/0"]
}
resource "aws_security_group_rule" "regla_dos" {

  type              = "egress"
  from_port         = 0
  to_port           = 0
  protocol          = -1
  description       = "regla_entrada"
  security_group_id = aws_security_group.name.id
  cidr_blocks       = ["0.0.0.0/0"]
}

