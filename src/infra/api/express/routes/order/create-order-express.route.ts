// infra/api/express/routes/order/create-order-express.route.ts
import { Request, Response, NextFunction } from "express";
import { Route, HttpMethod } from "../route";
import { CreateOrderUsecase, CreateOrderInputDto } from "../../../../../usecases/order/create-order.usecase";
import { authenticate } from "../../middlewares/token-authentication.middleware";
import { authorizeRoles } from "../../middlewares/authorization.middleware";
import { Role } from "@prisma/client";

export class CreateOrderRoute implements Route {
  private constructor(
    private readonly path: string,
    private readonly method: HttpMethod,
    private readonly createOrderUsecase: CreateOrderUsecase
  ) {}

  public static create(usecase: CreateOrderUsecase) {
    return new CreateOrderRoute("/orders", HttpMethod.POST, usecase);
  }

  public getHandler() {
    return [
      authenticate,
      async (request: Request, response: Response, next: NextFunction) => {
        try {
          const userId = (request as any).tokenPayload.userId;
          const input: CreateOrderInputDto = {
            userId,
            items: request.body.items,
          };

          const output = await this.createOrderUsecase.execute(input);
          response.status(201).json(output);
        } catch (err) {
          next(err);
        }
      },
    ];
  }

  public getPath() {
    return this.path;
  }

  public getMethod() {
    return this.method;
  }
}
