import { Prisma, PrismaClient } from "@prisma/client";
import { Product } from "../../../domain/product/entity/product";
import { ListProductsInputDto, ListProductsOutputDto } from "../../api/dto/product.dto";

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

  async findAllPaginated(input: ListProductsInputDto): Promise<ListProductsOutputDto> {
    const { page, limit, name, categoryId } = input;
    const skip = (page - 1) * limit;

    const where: any = {};

    if (name) {
      where.name = {
        contains: name,
        mode: 'insensitive',
      };
    }

    if (categoryId) {
      where.categoryId = categoryId;
    }

    const [products, total] = await Promise.all([
      this.prismaClient.product.findMany({
        where,
        skip,
        take: limit,
        include: { 
          productImages: {
            where: { type: 'main' },
            take: 1
          },
          category: true 
        },
        orderBy: { createdAt: "desc" },
      }),
      this.prismaClient.product.count({ where }),
    ]);

    return {
      data: products.map((p) => ({
        id: p.id,
        name: p.name,
        price: Number(p.price),
        fileUrl: p.fileUrl,
        categoryName: p.category.name,
        mainImageUrl: p.productImages[0]?.url ?? null
      })),
      total,
      page,
      limit,
    };
  }

  public async runInTransaction<T>(fn: (tx: Prisma.TransactionClient) => Promise<T>): Promise<T> {
    return await this.prismaClient.$transaction(fn);
  }
}
