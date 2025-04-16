import { PrismaClient, } from "@prisma/client";
import { Product } from "../../../domain/product/entity/product";

export class ProductRepository {
  private constructor(private readonly prismaClient: PrismaClient) {}

  public static create(prismaClient: PrismaClient) {
    return new ProductRepository(prismaClient);
  }

  public async save(product: Product): Promise<void> {
    await this.prismaClient.product.create({
      data: {
        id: product.id,
        name: product.name,
        price: product.price,
        fileUrl: product.fileUrl,
        createdBy: product.createdBy,
        categoryId: product.categoryId,
      },
    });
  }
}
