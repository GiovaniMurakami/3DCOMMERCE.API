import { Request, Response, NextFunction } from "express";
import { HttpMethod, Route } from "../route";
import { authenticate } from "../../middlewares/token-authentication.middleware";
import { authorizeRoles } from "../../middlewares/authorization.middleware";
import { Role } from "@prisma/client";
import { DeleteProductUsecase } from "../../../../../usecases/product/delete-product.usecase";

export type DeleteProductInputDto = {
  id: string;
};

export class DeleteProductRoute implements Route {
  private constructor(
    private readonly path: string,
    private readonly method: HttpMethod,
    private readonly deleteProductService: DeleteProductUsecase
  ) {}

  public static create(deleteProductService: DeleteProductUsecase) {
    return new DeleteProductRoute("/products/:id", HttpMethod.DELETE, deleteProductService);
  }

  public getHandler() {
    return [
      authenticate,
      authorizeRoles(Role.ADMIN),
      async (request: Request, response: Response, next: NextFunction) => {
        try {
          const productId = request.params.id;
          await this.deleteProductService.execute({ id: productId });
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
