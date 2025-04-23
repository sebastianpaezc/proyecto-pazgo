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
  vpc_id = aws_vpc.mi_vpc.id

  route {
    cidr_block     = "0.0.0.0/0"
    nat_gateway_id = aws_nat_gateway.mi_nat.id
  }

  tags = {
    Name = "tabla-rutas-privada"
  }
}
resource "aws_route_table_association" "asociacion_privada" {
  subnet_id      = aws_subnet.subred_privada.id
  route_table_id = aws_route_table.tabla_privada.id
}


##### Subnet privada #####
resource "aws_subnet" "subred_privada" {
  vpc_id            = aws_vpc.mi_vpc.id
  cidr_block        = "10.0.2.0/24"
  availability_zone = "us-east-1a"

  tags = {
    Name = "subred-privada"
  }
}

