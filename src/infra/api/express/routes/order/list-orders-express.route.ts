// infra/api/express/routes/order/list-orders-express.route.ts
import { Request, Response, NextFunction } from "express";
import { Route, HttpMethod } from "../route";
import { Role } from "@prisma/client";
import { authenticate } from "../../middlewares/token-authentication.middleware";
import { ListOrdersInputDto, ListOrdersOutputDto, ListOrdersUsecase } from "../../../../../usecases/order/list-order.usecase";

export class ListOrdersRoute implements Route {
  private constructor(
    private readonly path: string,
    private readonly method: HttpMethod,
    private readonly listOrdersUsecase: ListOrdersUsecase
  ) {}

  public static create(usecase: ListOrdersUsecase) {
    return new ListOrdersRoute("/orders", HttpMethod.GET, usecase);
  }

  public getHandler() {
    return [
      authenticate,
      async (request: Request, response: Response, next: NextFunction) => {
        try {
          const tokenPayload = (request as any).tokenPayload;
          const userId: string = tokenPayload.userId;
          const role: Role = tokenPayload.userRole;

          const input: ListOrdersInputDto = {
            userId,
            role,
          };

          const output: ListOrdersOutputDto = await this.listOrdersUsecase.execute(input);

          response.status(200).json(output);
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
