import {
  S3Client,
  PutObjectCommand,
  DeleteObjectCommand,
} from "@aws-sdk/client-s3";
import { StorageGateway } from "../../../domain/storage/storage.gateway";
import { CreateProductImageInputDto } from "../../../usecases/create-product/create-product.usecase";

export class AWSSimpleStorageService implements StorageGateway {
  private s3: S3Client;

  constructor() {
    this.s3 = new S3Client({
      region: process.env.AWS_REGION,
    });
  }

  private async save(
    bucketName: string,
    objectKey: string,
    data: Buffer
  ): Promise<void> {
    const command = new PutObjectCommand({
      Bucket: bucketName,
      Key: objectKey,
      Body: data,
    });

    await this.s3.send(command);
  }

  public async delete(bucketName: string, objectKey: string): Promise<void> {
    const command = new DeleteObjectCommand({
      Bucket: bucketName,
      Key: objectKey,
    });

    await this.s3.send(command);
  }

  async saveModel(productId: string, data: Buffer): Promise<string> {
    const bucket = process.env.S3_MODEL_BUCKET!;
    const key = `${productId}.stl`;
    await this.save(bucket, key, data);
    return `https://${bucket}.s3.amazonaws.com/${key}`;
  }
  
  async saveProductImages(productId: string, images: CreateProductImageInputDto[]): Promise<string[]> {
    const bucket = process.env.S3_IMAGE_BUCKET!;
    const urls: string[] = [];
  
    for (const [i, img] of images.entries()) {
      const key = `${productId}/${img.type}-${img.name}`;
      await this.save(bucket, key, img.image);
      urls.push(`https://${bucket}.s3.amazonaws.com/${key}`);
    }
  
    return urls;
  }
}

export default AWSSimpleStorageService;