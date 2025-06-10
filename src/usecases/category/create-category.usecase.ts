import { CategoryRepository } from "../../infra/repositories/product/category.repository";

export class CreateCategoryUseCase {
    private constructor(private readonly categoryRepository: CategoryRepository) { }

    public static create(categoryRepository: CategoryRepository) {
        return new CreateCategoryUseCase(categoryRepository);
    }

    public async execute(input: { name: string; userRole?: string }) {
        if (input.userRole !== "ADMIN") {
            throw new Error("Unauthorized: only ADMIN can create categories");
        }
        return this.categoryRepository.create(input.name);
    }
}