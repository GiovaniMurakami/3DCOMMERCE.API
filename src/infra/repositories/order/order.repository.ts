// infra/repositories/order/order.repository.ts
import { PrismaClient, Prisma, OrderStatus, Order } from "@prisma/client";
import { randomUUID } from "crypto";
import Decimal from "decimal.js";

export class OrderRepository {
  private constructor(private readonly prismaClient: PrismaClient) { }

  public static create(prismaClient: PrismaClient) {
    return new OrderRepository(prismaClient);
  }

  public async fetchProductPrices(productIds: string[]): Promise<Record<string, Decimal>> {
    const products = await this.prismaClient.product.findMany({
      where: { id: { in: productIds } },
      select: { id: true, price: true },
    });

    const result: Record<string, Decimal> = {};
    for (const p of products) {
      result[p.id] = new Decimal(p.price);
    }

    return result;
  }

  public async findAllOrders(): Promise<Order[]> {
    return this.prismaClient.order.findMany({
      include: {
        orderItem: true,
        user: {
          select: {
            fullName: true,
            email: true,
          },
        },
      },
    });
  }

  public async findOrdersByUserId(userId: string): Promise<Order[]> {
    return this.prismaClient.order.findMany({
      where: { userId },
      include: {
        orderItem: true,
      },
    });
  }
  public async runInTransaction<T>(fn: (tx: OrderTransactionClient) => Promise<T>): Promise<T> {
    return this.prismaClient.$transaction((tx) => fn(new OrderTransactionClient(tx)));
  }
}

export class OrderTransactionClient {
  constructor(private readonly tx: Prisma.TransactionClient) { }

  public async createOrder(
    id: string,
    params: {
      userId: string;
      address: string | null;
      currentStatus: OrderStatus;
      items: { productId: string; quantity: number }[];
      prices: Record<string, Decimal>;
    }
  ) {
    await this.tx.order.create({
      data: {
        id,
        userId: params.userId,
        address: params.address,
        currentStatus: params.currentStatus,
        orderItem: {
          create: params.items.map((item) => ({
            id: randomUUID(),
            productId: item.productId,
            quantity: item.quantity,
            price: params.prices[item.productId]
          })),
        },
      },
    });
  }

  public async addOrderStatusHistory(orderId: string, status: OrderStatus) {
    await this.tx.orderStatusHistory.create({
      data: {
        id: randomUUID(),
        orderId,
        status,
      },
    });
  }

  public async updateOrderStatus(orderId: string, status: OrderStatus) {
    console.log('olha o id:' , orderId);
    await this.tx.order.update({
      where: { id: orderId },
      data: { currentStatus: status },
    });
  }

  public async updateOrderItemPrice(orderItemId: string, price: Decimal) {
    console.log('olha o id:' , orderItemId);
    console.log('olha o price:' , price);
    await this.tx.orderItem.update({
      where: { id: orderItemId },
      data: { price },
    });
  }

}
