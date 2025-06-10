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

  async findAll(): Promise<CategoryDto[]> {
    const categories = await this.prismaClient.category.findMany({
      orderBy: { name: "asc" },
    });

    return categories.map(c => ({
      id: c.id,
      name: c.name,
    }));
  }

  async count(): Promise<number> {
    return this.prismaClient.category.count();
  }
}