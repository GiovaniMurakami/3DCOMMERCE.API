import { Request, Response } from "express";
import { Route, HttpMethod } from "../route";
import { ListProductsUseCase } from "../../../../../usecases/product/list-products.usecase";
import { expressValidatorHandler } from "../../middlewares/exporess-validator-handler.middleware";

export class ListProductsRoute implements Route {
  constructor(private readonly useCase: ListProductsUseCase) { }

  static create(useCase: ListProductsUseCase) {
    return new ListProductsRoute(useCase);
  }

  getPath(): string {
    return "/products";
  }

  getMethod(): HttpMethod {
    return HttpMethod.GET;
  }

  getHandler() {
    return [
      expressValidatorHandler,
      async (req: Request, res: Response) => {
        const page = parseInt(req.query.page as string) || 1;
        const limit = parseInt(req.query.limit as string) || 10;
        const name = req.query.name as string | undefined;
        const categoryId = req.query.categoryId as string | undefined;
        const categoryName = req.query.categoryName as string | undefined;

        const result = await this.useCase.execute({
          page,
          limit,
          name,
          categoryId,
          categoryName
        });

        return res.status(200).json(result);
      }
    ];
  }
}
