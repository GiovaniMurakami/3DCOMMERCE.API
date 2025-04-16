import {
  S3Client,
  PutObjectCommand,
  DeleteObjectCommand,
} from "@aws-sdk/client-s3";
import { StorageGateway } from "../../domain/storage/storage.gateway";

export class AWSSimpleStorageService implements StorageGateway {
  private s3: S3Client;

  constructor() {
    this.s3 = new S3Client({
      region: process.env.AWS_REGION,
    });
  }

  public async save(
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
}

export default AWSSimpleStorageService;