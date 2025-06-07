import { ListCategoriesOutputDto } from "../../infra/api/dto/category.dto";
import { CategoryRepository } from "../../infra/repositories/product/category.repository";
import { Usecase } from "../usecase";

export class ListCategoriesUseCase implements Usecase<void, ListCategoriesOutputDto> {
  private constructor(private readonly categoryRepository: CategoryRepository) {}

  public static create(categoryRepository: CategoryRepository): ListCategoriesUseCase {
    return new ListCategoriesUseCase(categoryRepository);
  }

  async execute(): Promise<ListCategoriesOutputDto> {
    const data = await this.categoryRepository.findAll();
    const total = await this.categoryRepository.count();

    return {
      data,
      total,
    };
  }
}