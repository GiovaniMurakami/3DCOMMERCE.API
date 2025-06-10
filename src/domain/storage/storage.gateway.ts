import { CreateProductImageInputDto } from "../../usecases/product/create-product.usecase";

export interface StorageGateway {
  saveModel(productId: string, data: Buffer): Promise<string>;
  saveProductImages(productId: string, images: CreateProductImageInputDto[]): Promise<string[]>;
  delete(bucket: string, key: string): Promise<void>;
}