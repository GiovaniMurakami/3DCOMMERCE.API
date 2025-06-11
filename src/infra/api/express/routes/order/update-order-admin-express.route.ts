import { Request, Response, NextFunction } from "express";
import { UpdateOrderAdminUsecase } from "../../../../../usecases/order/update-order-admin.usecase";
import { HttpMethod, Route } from "../route";
import { authenticate } from "../../middlewares/token-authentication.middleware";
import { authorizeRoles } from "../../middlewares/authorization.middleware";
import { OrderStatus, Role } from "@prisma/client";

type UpdateOrderAdminInputDto = {
  orderId: string;
  status?: OrderStatus;
  items?: { orderItemId: string; price: number }[];
};

export class UpdateOrderAdminRoute implements Route {
  private constructor(
    private readonly path: string,
    private readonly method: HttpMethod,
    private readonly updateOrderAdminUsecase: UpdateOrderAdminUsecase
  ) { }

  public static create(updateOrderAdminUsecase: UpdateOrderAdminUsecase): UpdateOrderAdminRoute {
    return new UpdateOrderAdminRoute(
      "/orders/:id",
      HttpMethod.PATCH,
      updateOrderAdminUsecase
    );
  }

  public getHandler() {
    return [
      authenticate,
      authorizeRoles(Role.ADMIN),
      async (request: Request, response: Response, next: NextFunction) => {
        try {
          const orderId = request.params.id;
          const { status, items } = request.body;

          const input: UpdateOrderAdminInputDto = {
            orderId,
            status: status ? status as OrderStatus : undefined,
            items,
          };

          await this.updateOrderAdminUsecase.execute(input);
          response.status(204).send();
        } catch (err) {
          next(err);
        }
      }
    ];
  }

  public getPath(): string {
    return this.path;
  }

  public getMethod(): HttpMethod {
    return this.method;
  }
}
