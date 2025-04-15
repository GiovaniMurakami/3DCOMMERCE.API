import * as AWS from "aws-sdk";
import { StorageGateway } from "../../domain/storage/storage.gateway";

export class AWSSimpleStorageService implements StorageGateway {
  private s3: AWS.S3;

  constructor() {
    this.s3 = new AWS.S3({
      region: process.env.AWS_REGION,
    });
  }

  public async save(
    bucketName: string,
    objectKey: string,
    data: Buffer
  ): Promise<void> {
    const params = {
      Bucket: bucketName,
      Key: objectKey,
      Body: data,
    };

    await this.s3.putObject(params).promise();
  }

  public async delete(bucketName: string, objectKey: string): Promise<void> {
    const params = {
      Bucket: bucketName,
      Key: objectKey,
    };

    await this.s3.deleteObject(params).promise();
  }
}