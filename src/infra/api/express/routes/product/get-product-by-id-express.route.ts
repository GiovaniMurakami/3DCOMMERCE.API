import { Request, Response, NextFunction } from "express";
import { Route, HttpMethod } from "../route";
import { expressValidatorHandler } from "../../middlewares/exporess-validator-handler.middleware";
import { param, validationResult } from "express-validator";
import { GetProductByIdUseCase } from "../../../../../usecases/product/find-product-by-id.usecase";

export class GetProductByIdRoute implements Route {
  constructor(private readonly useCase: GetProductByIdUseCase) { }

  static create(useCase: GetProductByIdUseCase) {
    return new GetProductByIdRoute(useCase);
  }

  getPath(): string {
    return "/products/:id";
  }

  getMethod(): HttpMethod {
    return HttpMethod.GET;
  }

  getHandler() {
    return [
      expressValidatorHandler,
      async (req: Request, res: Response, next: NextFunction) => {
        try {
          const id = req.params.id;

          const result = await this.useCase.execute({ id });

          if (!result) {
            return res.status(404).json({ message: "Product not found" });
          }

          return res.status(200).json(result);
        } catch (err) {
          next(err);
        }

      }
    ];
  }
}
