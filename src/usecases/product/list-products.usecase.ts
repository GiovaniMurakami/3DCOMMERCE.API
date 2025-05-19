import { ListProductsInputDto, ListProductsOutputDto } from "../../infra/api/dto/product.dto";
import { ProductRepository } from "../../infra/repositories/product/product.repository";
import { Usecase } from "../usecase";

export class ListProductsUseCase implements Usecase<ListProductsInputDto, ListProductsOutputDto> {
  private constructor(private readonly productRepository: ProductRepository) {}

  public static create(productRepository: ProductRepository): ListProductsUseCase {
    return new ListProductsUseCase(productRepository);
  }

  async execute(input: ListProductsInputDto): Promise<ListProductsOutputDto> {
    return this.productRepository.findAllPaginated(input);
  }
}
