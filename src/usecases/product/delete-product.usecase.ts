import { StorageGateway } from "../../domain/storage/storage.gateway";
import { DeleteProductInputDto } from "../../infra/api/express/routes/product/delete-product-express.route";
import { ProductRepository } from "../../infra/repositories/product/product.repository";
import { Usecase } from "../usecase";

export class DeleteProductUsecase implements Usecase<DeleteProductInputDto, void> {
  constructor(
    private readonly productRepository: ProductRepository,
    private readonly storageGateway: StorageGateway
  ) {}

  public static create(
    productRepository: ProductRepository,
    storageGateway: StorageGateway
  ) {
    return new DeleteProductUsecase(productRepository, storageGateway);
  }

  public async execute(input: DeleteProductInputDto): Promise<void> {
    const { modelUrl, imageUrls } = await this.productRepository.delete(input.id);

    if (modelUrl) {
      const { bucket, key } = this.extractBucketAndKey(modelUrl);
      await this.storageGateway.delete(bucket, key);
    }

    for (const url of imageUrls) {
      const { bucket, key } = this.extractBucketAndKey(url);
      await this.storageGateway.delete(bucket, key);
    }
  }

  private extractBucketAndKey(s3Url: string): { bucket: string; key: string } {
    // Exemplo: https://bucket-name.s3.amazonaws.com/key
    const match = s3Url.match(/^https:\/\/([^.]+)\.s3\.amazonaws\.com\/(.+)$/);
    if (!match) throw new Error("Invalid S3 URL");
    return { bucket: match[1], key: match[2] };
  }
}
