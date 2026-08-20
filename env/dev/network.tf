##### IP elastica #####
resource "aws_eip" "nat_eip" {
  domain = "vpc"

  tags = {
    Name = "eip-nat"
  }
}

##### Nat Gateway #####
resource "aws_nat_gateway" "mi_nat" {
  allocation_id = aws_eip.nat_eip.id
  subnet_id     = data.aws_subnet.zd_1s.id

  tags = {
    Name = "nat-gateway"
  }

  depends_on = [aws_eip.nat_eip]
}

##### Ruta table #####
resource "aws_route_table" "mi_tabla_ruta_privada" {
  vpc_id = data.aws_vpc.vpc_default.id

  route {
    cidr_block     = "0.0.0.0/0"
    nat_gateway_id = aws_nat_gateway.mi_nat.id
  }

  tags = {
    Name = "tabla-rutas-privada_1a"
  }
}
resource "aws_route_table_association" "asociacion_privada" {
  subnet_id      = aws_subnet.subred_privada.id
  route_table_id = aws_route_table.mi_tabla_ruta_privada.id
}

##### Subnet privada #####
resource "aws_subnet" "subred_privada" {
  vpc_id            = data.aws_vpc.vpc_default.id
  cidr_block        = "172.31.250.0/24"
  availability_zone = "us-east-1a"

  tags = {
    Name = "subred-privada"
  }
}
##############################################################
############# zona ib
resource "aws_eip" "nat_eip_1b" {
  domain = "vpc"

  tags = {
    Name = "eip-nat_1b"
  }
}

##### Nat Gateway #####
resource "aws_nat_gateway" "mi_nat_1b" {
  allocation_id = aws_eip.nat_eip_1b.id
  subnet_id     = data.aws_subnet.zd_2s.id

  tags = {
    Name = "nat-gateway_1b"
  }

  depends_on = [aws_eip.nat_eip_1b]
}

##### Ruta table #####
resource "aws_route_table" "mi_tabla_ruta_privada_1b" {
  vpc_id = data.aws_vpc.vpc_default.id

  route {
    cidr_block     = "0.0.0.0/0"
    nat_gateway_id = aws_nat_gateway.mi_nat_1b.id
  }

  tags = {
    Name = "tabla-rutas-privada_1b"
  }
}

resource "aws_route_table_association" "asociacion_privada_1b" {
  subnet_id      = aws_subnet.subred_privada_1b.id
  route_table_id = aws_route_table.mi_tabla_ruta_privada_1b.id
}

##### Subnet privada #####
resource "aws_subnet" "subred_privada_1b" {
  vpc_id            = data.aws_vpc.vpc_default.id
  cidr_block        = "172.31.100.0/24"
  availability_zone = "us-east-1b"

  tags = {
    Name = "subred-privada_1b"
  }
}
