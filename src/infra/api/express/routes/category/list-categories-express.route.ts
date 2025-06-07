import { Request, Response } from "express";
import { Route, HttpMethod } from "../route";
import { ListCategoriesUseCase } from "../../../../../usecases/product/list-categories.usecase";

export class ListCategoriesRoute implements Route {
  constructor(private readonly useCase: ListCategoriesUseCase) {}

  static create(useCase: ListCategoriesUseCase) {
    return new ListCategoriesRoute(useCase);
  }

  getPath(): string {
    return "/categories";
  }

  getMethod(): HttpMethod {
    return HttpMethod.GET;
  }

  getHandler() {
    return [
      async (req: Request, res: Response) => {
        const result = await this.useCase.execute();
        return res.status(200).json(result);
      },
    ];
  }
}