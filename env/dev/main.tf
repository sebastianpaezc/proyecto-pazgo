
resource "aws_instance" "instancia-dev" {
  ami                    = "ami-01816d07b1128cd2d"
  instance_type          = "t2.micro"
  vpc_security_group_ids = [aws_security_group.sg_pazgo.id]
  subnet_id              = aws_subnet.subred_privada.id
  tags = {
    Name = "server_pazgo"
  }
  depends_on = [aws_subnet.subred_privada]
}

resource "aws_security_group" "sg_pazgo" {
  name        = "sg_pazgo"
  description = "grupo de seguridad instancia"
  vpc_id      = data.aws_vpc.vpc_default.id
}
resource "aws_security_group_rule" "regla_uno" {

  type              = "ingress"
  from_port         = 80
  to_port           = 80
  protocol          = "tcp"
  description       = "regla_entrada"
  security_group_id = aws_security_group.sg_pazgo.id
  cidr_blocks       = ["0.0.0.0/0"]
}
resource "aws_security_group_rule" "in443" {

  type              = "ingress"
  from_port         = 443
  to_port           = 443
  protocol          = "tcp"
  description       = "regla_entrada"
  security_group_id = aws_security_group.sg_pazgo.id
  cidr_blocks       = ["0.0.0.0/0"]
}
resource "aws_security_group_rule" "out80" {

  type              = "egress"
  from_port         = 80
  to_port           = 80
  protocol          = "tcp"
  description       = "regla_entrada"
  security_group_id = aws_security_group.sg_pazgo.id
  cidr_blocks       = ["0.0.0.0/0"]
}
resource "aws_security_group_rule" "out443" {

  type              = "egress"
  from_port         = 443
  to_port           = 443
  protocol          = "tcp"
  description       = "regla_entrada"
  security_group_id = aws_security_group.sg_pazgo.id
  cidr_blocks       = ["0.0.0.0/0"]
}

















/*resource "aws_instance" "juanito" {
  ami                    = var.ami_id
  instance_type          = var.tipo_instancia
  vpc_security_group_ids = length(var.vpc_security_group_ids) > 0 ? var.vpc_security_group_ids : [data.aws_security_group.default.id]
  subnet_id              = var.subnet_id

  tags = {
    Name = local.name
  }
}*/



