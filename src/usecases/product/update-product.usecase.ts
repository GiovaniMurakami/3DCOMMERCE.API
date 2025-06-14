import { ValidationError } from "../../domain/errors/common-validation-error";
import { StorageGateway } from "../../domain/storage/storage.gateway";
import { ProductRepository } from "../../infra/repositories/product/product.repository";
import { Usecase } from "../usecase";
import { CreateProductImageInputDto } from "./create-product.usecase";
import { randomUUID } from "crypto";
import { ProductImage } from "../../domain/product/entity/product-image";
import Decimal from "decimal.js";

export type UpdateProductInputDto = {
  id: string;
  name: string;
  price: Decimal;
  description: string;
  categoryId: string;
  images: CreateProductImageInputDto[];
  model?: Buffer;
  userId: string;
};

export class UpdateProductUsecase implements Usecase<UpdateProductInputDto, void> {
  private constructor(
    private readonly productRepository: ProductRepository,
    private readonly storageGateway: StorageGateway
  ) { }

  public static create(productRepository: ProductRepository, storageGateway: StorageGateway) {
    return new UpdateProductUsecase(productRepository, storageGateway);
  }

  public async execute(input: UpdateProductInputDto): Promise<void> {
    if (input.images.length > 0) {
      this.validateMainImage(input.images);
    }

    const existing = await this.productRepository.findById(input.id);
    if (!existing) throw new Error("Product not found");

    await this.productRepository.runInTransaction(async (tx) => {
      await this.productRepository.update(input.id, {
        name: input.name,
        price: input.price,
        description: input.description,
        categoryId: input.categoryId,
      });

      if (input.model) {
        const modelUrl = await this.storageGateway.saveModel(input.id, input.model);
        await this.productRepository.updateModelUrl(input.id, modelUrl);
      }

      if (input.images.length > 0) {
        const updatedImages: ProductImage[] = input.images.map((img) => ({
          id: randomUUID(),
          url: "",
          type: img.type,
          productId: input.id,
        }));

        const imagesUrl = await this.storageGateway.saveProductImages(input.id, input.images);
        updatedImages.forEach((img, i) => (img.url = imagesUrl[i]));

        await this.productRepository.replaceProductImages(input.id, updatedImages);
      }
    });
  }


  private validateMainImage(images: CreateProductImageInputDto[]) {
    const mainImagesCount = images.filter((img) => img.type.toLowerCase() === "main").length;
    if (mainImagesCount !== 1) {
      throw new ValidationError('There must be exactly one image with the type "main"', 400);
    }
  }
}
