import { ValidationError } from "../../domain/errors/common-validation-error";
import { ProductOutputDto } from "../../infra/api/dto/product.dto";
import { ProductRepository } from "../../infra/repositories/product/product.repository";
import { isValidUuid } from "../../utils/uuid.utils";
import { Usecase } from "../usecase";

export interface GetProductByIdInputDto {
  id: string;
}

export type GetProductByIdOutputDto = ProductOutputDto | null;

export class GetProductByIdUseCase implements Usecase<GetProductByIdInputDto, GetProductByIdOutputDto> {
  private constructor(private readonly productRepository: ProductRepository) {}

  public static create(productRepository: ProductRepository): GetProductByIdUseCase {
    return new GetProductByIdUseCase(productRepository);
  }

  async execute(input: GetProductByIdInputDto): Promise<GetProductByIdOutputDto> {
    if (isValidUuid(input.id) === false) throw new ValidationError('Invalid UUID', 400);
    const product = await this.productRepository.findById(input.id);
    if (!product) return null;

    return {
      id: product.id,
      name: product.name,
      price: product.price.toString(),
      fileUrl: product.fileUrl,
      createdBy: product.createdBy,
      categoryId: product.categoryId,
      createdAt: product.createdAt,
      updatedAt: product.updatedAt,
      category: product.category ? {
        id: product.category.id,
        name: product.category.name,
      } : undefined,
      productImages: product.productImages?.map(img => ({
        id: img.id,
        url: img.url,
        type: img.type,
      })),
    };
  }
}
