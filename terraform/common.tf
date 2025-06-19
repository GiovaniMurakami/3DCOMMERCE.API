provider "aws" {
  region = "us-east-2"
}

resource "aws_iam_role_policy_attachment" "AWSLambdaVPCAccessExecutionRole" {
    role       = "nodejs-aws-lambda-dev-us-east-1-lambdaRole"
    policy_arn = "arn:aws:iam::aws:policy/service-role/AWSLambdaVPCAccessExecutionRole"
}