import { OrderStatus } from "@prisma/client";
import Decimal from "decimal.js";
import { OrderRepository } from "../../infra/repositories/order/order.repository";

type Input = {
  orderId: string;
  status?: OrderStatus;
  items?: { orderItemId: string; price: number }[];
};

export class UpdateOrderAdminUsecase {
  private constructor(private readonly orderRepository: OrderRepository) {}

  public static create(orderRepository: OrderRepository) {
    return new UpdateOrderAdminUsecase(orderRepository);
  }

  async execute(input: Input): Promise<void> {
    await this.orderRepository.runInTransaction(async (tx) => {
      if (input.status) {
        await tx.updateOrderStatus(input.orderId, input.status);
        await tx.addOrderStatusHistory(input.orderId, input.status);
      }

      if (input.items?.length) {
        for (const item of input.items) {
          console.log("olha o item inteiro: ", item);
          await tx.updateOrderItemPrice(item.orderItemId, new Decimal(item.price));
        }
      }
    });
  }
}
