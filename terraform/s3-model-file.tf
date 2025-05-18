resource "aws_s3_bucket" "tg-3d-model" {
  bucket = "tg-3d-model"

  tags = {
    Name        = "3D Models"
    Environment = "Prod"
  }
}