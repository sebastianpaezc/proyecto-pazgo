#####################     zona disponibilidad  us-east-1a ###################
resource "aws_instance" "instancia_1a" {
  ami                    = "ami-01816d07b1128cd2d"
  instance_type          = "t2.micro"
  vpc_security_group_ids = [aws_security_group.sg_pazgo.id]
  subnet_id              = aws_subnet.subred_privada.id
  tags = {
    Name = "zona-1a"
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

#####################   zona disponibilidad  us-east-1b ###################

resource "aws_instance" "instancia-1b" {
  ami                    = "ami-01816d07b1128cd2d"
  instance_type          = "t2.micro"
  vpc_security_group_ids = [aws_security_group.sg_pazgo.id]
  subnet_id              = aws_subnet.subred_privada_1b.id
  tags = {
    Name = "zona-1b"
  }
  depends_on = [aws_subnet.subred_privada]
}

##################### Auto Scaling ########################

# Auto Scaling Group
resource "aws_autoscaling_group" "grupo_auto" {
  desired_capacity = 4
  max_size         = 6
  min_size         = 2
  vpc_zone_identifier = [
    aws_subnet.subred_privada.id,
    aws_subnet.subred_privada_1b.id
  ]
  launch_template {
    id      = aws_launch_template.ejemplo.id
    version = "$Latest"
  }

  tag {
    key                 = "Name"
    value               = "instancia-asg"
    propagate_at_launch = true
  }

  health_check_type         = "EC2"
  health_check_grace_period = 300

  lifecycle {
    create_before_destroy = true
  }
}


#### plantilla de lanzamiento
resource "aws_launch_template" "ejemplo" {
  name_prefix   = "plantilla-ejemplo-"
  image_id      = "ami-01816d07b1128cd2d" # Sustituye por una AMI válida
  instance_type = "t2.micro"

  tag_specifications {
    resource_type = "instance"
    tags = {
      Name = "instancia-autoscaling"
    }
  }
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



