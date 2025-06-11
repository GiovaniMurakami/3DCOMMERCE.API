// usecases/order/create-order.usecase.ts
import { Usecase } from "../usecase";
import { OrderRepository } from "../../infra/repositories/order/order.repository";
import { randomUUID } from "crypto";
import { Decimal } from "decimal.js";
import { OrderStatus } from "@prisma/client";

export type CreateOrderItemInputDto = {
  productId: string;
  quantity: number;
};

export type CreateOrderInputDto = {
  items: CreateOrderItemInputDto[];
  address?: string;
  userId: string;
};

export type CreateOrderOutputDto = {
  id: string;
};

export class CreateOrderUsecase implements Usecase<CreateOrderInputDto, CreateOrderOutputDto> {
  private constructor(private readonly orderRepository: OrderRepository) { }

  public static create(orderRepository: OrderRepository) {
    return new CreateOrderUsecase(orderRepository);
  }

  public async execute(input: CreateOrderInputDto): Promise<CreateOrderOutputDto> {
    const id = randomUUID();

    // 🟢 Buscar os preços REAIS dos produtos ANTES da transação
    const prices = await this.orderRepository.fetchProductPrices(input.items.map(i => i.productId));

    await this.orderRepository.runInTransaction(async (tx) => {
      await tx.createOrder(id, {
        userId: input.userId,
        address: input.address ?? null,
        currentStatus: OrderStatus.WAITING_CONFIRMATION,
        items: input.items,
        prices: prices
      });

      await tx.addOrderStatusHistory(id, OrderStatus.WAITING_CONFIRMATION);
    });

    return { id };
  }

}
