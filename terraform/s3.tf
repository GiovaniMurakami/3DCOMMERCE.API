provider "aws" {
  region = "us-east-2"
}

resource "aws_s3_bucket" "tg_3d_model" {
  bucket = "tg_3d_model"

  tags = {
    Name        = "3D Models"
    Environment = "Prod"
  }
}