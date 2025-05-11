# Environment Configuration

### .env File
- DATABASE_URL: Database URL used for Prisma connection. Image example: ![explanation about database url building](./docs/images/database-url-dot-env-configuration.png)

- DATABASE_USER: Username set for the database when created via Docker Compose. Example: root

- DATABASE_PASSWORD: Password set for the database when created via Docker Compose. Example: root

- S3_IMAGE_BUCKET: Bucket for model images. Example: tg-model-image

- S3_MODEL_BUCKET: Bucket for model file. Example: tg-3d-model