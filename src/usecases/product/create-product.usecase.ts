import Decimal from "decimal.js";
import { Product } from "../../domain/product/entity/product";
import { CreateProductOutputDto } from "../../infra/api/express/routes/product/create-product-express.route";
import { ProductRepository } from "../../infra/repositories/product/product.repository";
import { Usecase } from "../usecase";
import { randomUUID } from "crypto";
import { StorageGateway } from "../../domain/storage/storage.gateway";
import { ProductImage } from "../../domain/product/entity/product-image";
import { ValidationError } from "../../domain/errors/common-validation-error";

export type CreateProductInputDto = {
  name: string;
  price: Decimal;
  categoryId: string;
  images: CreateProductImageInputDto[];
  model: Buffer;
};

export type CreateProductImageInputDto = {
  name: string;
  image: Buffer;
  type: string;
}

export class CreateProductUsecase implements Usecase<CreateProductInputDto, CreateProductOutputDto> {
  private constructor(
    private readonly productRepository: ProductRepository,
    private readonly storageGateway: StorageGateway
  ) {}

  public static create(productRepository: ProductRepository, storageGateway: StorageGateway) {
    return new CreateProductUsecase(productRepository, storageGateway);
  }

  public async execute(createProductInputDto: CreateProductInputDto): Promise<CreateProductOutputDto> {
    this.validateMainImage(createProductInputDto.images);

    const productUuid = randomUUID();
    const userUuidMock = "65334411-8f49-41fe-a3d3-b8e8335af509";
    let fileUrl: string;
    let imagesUrl: string[];
    
    const productImages: ProductImage[] = createProductInputDto.images.map(
      (img) => new ProductImage(randomUUID(), "", img.type, productUuid)
    );

    const product: Product = new Product(
      productUuid,
      createProductInputDto.name,
      createProductInputDto.price,
      "",
      userUuidMock,
      createProductInputDto.categoryId,
      productImages
    );

    await this.productRepository.runInTransaction(async (tx) => {
      await this.productRepository.save(product);

      fileUrl = await this.storageGateway.saveModel(productUuid, createProductInputDto.model);
      imagesUrl = await this.storageGateway.saveProductImages(productUuid, createProductInputDto.images);

      productImages.forEach((img, i) => (img.url = imagesUrl[i]));

      await this.productRepository.updateFileAndImagesUrls(productUuid, fileUrl, productImages);
    });

    const output = this.presentOutput(product);
    return output;
  }
  

  private presentOutput(product: Product): CreateProductOutputDto {
    const output: CreateProductOutputDto = {
      id: product.id!,
    };

    return output;
  }

  private validateMainImage(images: CreateProductImageInputDto[]) {
    const mainImagesCount = images.filter(img => img.type.toLowerCase() === "main").length;

    if (mainImagesCount !== 1) {
      throw new ValidationError('There must be exactly one image with the type "main" (main product image)', 400);
    }
  }
}
