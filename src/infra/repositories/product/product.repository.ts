import { Prisma, PrismaClient, } from "@prisma/client";
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

  public async updateFileAndImagesUrls(
    productId: string,
    fileUrl: string,
    productImages: { id: string; url: string; type: string }[]
  ): Promise<void> {
    await this.prismaClient.product.update({
      where: { id: productId },
      data: { fileUrl },
    });

    await this.prismaClient.productImage.createMany({
      data: productImages.map((img) => ({
        id: img.id,
        url: img.url,
        type: img.type,
        productId,
      })),
    });
  }

  public async runInTransaction<T>(fn: (tx: Prisma.TransactionClient) => Promise<T>): Promise<T> {
    return await this.prismaClient.$transaction(fn);
  }
}
