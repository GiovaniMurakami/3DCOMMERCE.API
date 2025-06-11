// usecases/order/list-orders.usecase.ts
import { Role, Order } from "@prisma/client";

export type ListOrdersInputDto = {
  userId: string;
  role: Role;
  page: number;
  limit: number;
};

export type ListOrdersOutputDto = {
  data: Order[];
  total: number;
  page: number;
  limit: number;
};
export class ListOrdersUsecase {
  private constructor(private readonly orderRepository: any) { }

  public static create(orderRepository: any) {
    return new ListOrdersUsecase(orderRepository);
  }

  public async execute(input: ListOrdersInputDto): Promise<ListOrdersOutputDto> {
    const offset = (input.page - 1) * input.limit;

    let result;
    if (input.role === Role.ADMIN) {
      result = await this.orderRepository.findAllOrders(input.limit, offset);
    } else {
      result = await this.orderRepository.findOrdersByUserId(input.userId, input.limit, offset);
    }

    return {
      data: result.data,
      total: result.total,
      page: input.page,
      limit: input.limit,
    };
  }
}
