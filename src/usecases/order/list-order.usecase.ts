// usecases/order/list-orders.usecase.ts
import { Role, Order } from "@prisma/client";

export type ListOrdersInputDto = {
  userId: string;
  role: Role;
};

export type ListOrdersOutputDto = {
  orders: Order[];
};

export class ListOrdersUsecase {
  private constructor(private readonly orderRepository: any) {}

  public static create(orderRepository: any) {
    return new ListOrdersUsecase(orderRepository);
  }

  public async execute(input: ListOrdersInputDto): Promise<ListOrdersOutputDto> {
    let orders: Order[];
    if (input.role === Role.ADMIN) {
      orders = await this.orderRepository.findAllOrders();
    } else {
      orders = await this.orderRepository.findOrdersByUserId(input.userId);
    }

    return { orders };
  }
}
