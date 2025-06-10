import { Prisma, PrismaClient } from "@prisma/client";
import { Product } from "../../../domain/product/entity/product";
import { ListProductsInputDto, ListProductsOutputDto } from "../../api/dto/product.dto";
import { ProductImage } from "../../../domain/product/entity/product-image";
import { Category } from "../../../domain/product/entity/category";
import Decimal from "decimal.js";

export class ProductRepository {
  private constructor(private readonly prismaClient: PrismaClient) { }

  public async findById(id: string): Promise<Product | null> {
    const productRecord = await this.prismaClient.product.findUnique({
      where: { id },
      include: {
        productImages: true,
        category: true,
      },
    });

    if (!productRecord) return null;

    const images: ProductImage[] = productRecord.productImages.map(img => new ProductImage(
      img.id,
      img.url,
      img.type,
      img.productId
    ));

    const category: Category | undefined = productRecord.category
      ? new Category(productRecord.category.id, productRecord.category.name, productRecord.category.createdAt, productRecord.category.updatedAt)
      : undefined;

    const product = new Product(
      productRecord.id,
      productRecord.name,
      new Decimal(productRecord.price),
      productRecord.fileUrl,
      productRecord.description!,
      productRecord.createdBy,
      productRecord.categoryId,
      images
    );

    product.category = category;
    product.updatedAt = productRecord.updatedAt ?? undefined;

    return product;
  }

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
        description: product.description,
        createdBy: product.createdBy,
        categoryId: product.categoryId,
      },
    });
  }

  public async update(productId: string, data: {
    name: string;
    price: Decimal;
    description: string;
    categoryId: string;
  }): Promise<void> {
    console.log('oia: ', productId);
    await this.prismaClient.product.update({
      where: { id: productId },
      data,
    });
  }

  async delete(productId: string): Promise<{
    modelUrl: string | null;
    imageUrls: string[];
  }> {
    return await this.runInTransaction(async (tx) => {
      const product = await tx.product.findUnique({
        where: { id: productId },
        include: {
          productImages: true,
        },
      });

      if (!product) {
        throw new Error("Product not found");
      }

      await tx.productImage.deleteMany({
        where: { productId }
      });

      await tx.product.delete({
        where: { id: productId },
      });

      return {
        modelUrl: product.fileUrl,
        imageUrls: product.productImages.map(img => img.url),
      };
    });
  }



  public async updateModelUrl(productId: string, modelUrl: string): Promise<void> {
    await this.prismaClient.product.update({
      where: { id: productId },
      data: { fileUrl: modelUrl },
    });
  }

  public async replaceProductImages(productId: string, images: ProductImage[]): Promise<void> {
    await this.prismaClient.productImage.deleteMany({ where: { productId } });
    await this.prismaClient.productImage.createMany({
      data: images.map((img) => ({
        id: img.id,
        url: img.url,
        type: img.type,
        productId,
      })),
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
    const { page, limit, name, categoryId, categoryName } = input;
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
    } else if (categoryName) {
      where.category = {
        name: {
          contains: categoryName,
          mode: 'insensitive',
        }
      };
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
