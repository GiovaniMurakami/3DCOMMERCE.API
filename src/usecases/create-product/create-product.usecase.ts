import Decimal from "decimal.js";
import { Product } from "../../domain/product/entity/product";
import { CreateProductOutputDto } from "../../infra/api/express/routes/product/create-product-express.route";
import { ProductRepository } from "../../infra/repositories/product/product.repository";
import { Usecase } from "../usecase";
import { randomUUID } from "crypto";

export type CreateProductInputDto = {
  name: string;
  price: Decimal
  categoryId: string;
  images: CreateProductImageInputDto[];
  model: Buffer;
};

export type CreateProductImageInputDto = {
  image: Buffer;
  type: string;
}

export class CreateProductUsecase implements Usecase<CreateProductInputDto, CreateProductOutputDto> {
  private constructor(private readonly productRepository: ProductRepository) {}

  public static create(productRepository: ProductRepository) {
    return new CreateProductUsecase(productRepository);
  }

  public async execute(createProductInputDto: CreateProductInputDto): Promise<CreateProductOutputDto> {
    const fileUrl = "saveOnS3";
    const imagesUrl = "forEachImageSaveOnS3";

    const product: Product = new Product(
      randomUUID(),
      createProductInputDto.name,
      createProductInputDto.price,
      fileUrl,
      "userUuidMock",
      createProductInputDto.categoryId
    )

    await this.productRepository.save(product);

    const output = this.presentOutput(product);

    return output;
  }

  private presentOutput(product: Product): CreateProductOutputDto {
    const output: CreateProductOutputDto = {
      id: product.id!,
    };

    return output;
  }
}
