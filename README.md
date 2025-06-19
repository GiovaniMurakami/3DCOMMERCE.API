# Environment Configuration

### .env File
[.env example](./.env.example)

- DATABASE_URL: Database URL used for Prisma connection. Image example: ![explanation about database url building](./docs/images/database-url-dot-env-configuration.png)

- DATABASE_USER: Username set for the database when created via Docker Compose. Example: root

- DATABASE_PASSWORD: Password set for the database when created via Docker Compose. Example: root

- AWS_BUCKET_REGION: For the bucket location

- S3_IMAGE_BUCKET: Bucket for model images. Example: tg-model-image

- S3_MODEL_BUCKET: Bucket for model file. Example: tg-3d-model

- JWT_ACCESS_TOKEN_SECRET: Secret for JWT token

- JWT_REFRESH_TOKEN_SECRET: Secret for JWT token

### Postman collection

[Postman collection](./docs/collection/TG_3D_Commerce.postman_collection.json)
