resource "aws_s3_bucket" "tg-model-image" {
  bucket = "tg-model-image"

  tags = {
    Name        = "3D Model Images"
    Environment = "Prod"
  }
}