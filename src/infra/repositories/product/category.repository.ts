import { PrismaClient } from "@prisma/client";
import { CategoryDto } from "../../api/dto/category.dto";

export class CategoryRepository {
  private constructor(private readonly prismaClient: PrismaClient) { }

  public static create(prismaClient: PrismaClient) {
    return new CategoryRepository(prismaClient);
  }

  async create(name: string): Promise<CategoryDto> {
    const category = await this.prismaClient.category.create({
      data: {
        id: crypto.randomUUID(),
        name
      }
    });
    return {
      id: category.id,
      name: category.name,
    };
  }

  async update(id: string, name: string): Promise<void> {
    await this.prismaClient.category.update({
      where: { id },
      data: { name }
    });
  }

  async hasProducts(categoryId: string): Promise<boolean> {
    const count = await this.prismaClient.product.count({
      where: { categoryId }
    });
    return count > 0;
  }

  async findById(id: string): Promise<CategoryDto | null> {
    const category = await this.prismaClient.category.findUnique({
      where: { id }
    });
    if (!category) return null;
    return {
      id: category.id,
      name: category.name,
    };
  }

  async findAll(): Promise<CategoryDto[]> {
    const categories = await this.prismaClient.category.findMany({
      orderBy: { name: "asc" },
    });

    return categories.map(c => ({
      id: c.id,
      name: c.name,
    }));
  }

  async delete(id: string): Promise<void> {
    await this.prismaClient.category.delete({
      where: { id }
    });
  }

  async count(): Promise<number> {
    return this.prismaClient.category.count();
  }
}