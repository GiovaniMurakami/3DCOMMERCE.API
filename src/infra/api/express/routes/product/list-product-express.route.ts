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
        let sortBy = (req.query.sortBy as string | undefined) ?? "createdAt";
        const sortDir = this.parseSortDir(req.query.sortDir as string | undefined) ?? "desc";
        const allowedSortBy = ["createdAt", "name", "price", "views"] as const;
        if (!allowedSortBy.includes(sortBy as any)) {
          return res.status(400).json({ error: "Invalid sortBy field" });
        }
        const result = await this.useCase.execute({
          page,
          limit,
          name,
          categoryId,
          categoryName,
          sortBy,
          sortDir
        });

        return res.status(200).json(result);
      }
    ];
  }
  parseSortDir(dir: string | undefined): "asc" | "desc" | undefined {
    if (!dir) return undefined;
    const lower = dir.toLowerCase();
    return lower === "asc" || lower === "desc" ? lower : undefined;
  }
}
