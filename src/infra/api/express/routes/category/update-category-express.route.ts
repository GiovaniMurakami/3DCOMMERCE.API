import { Request, Response, NextFunction } from "express";
import { HttpMethod, Route } from "../route";
import { CategoryRepository } from "../../../../../infra/repositories/product/category.repository";
import { authenticate } from "../../middlewares/token-authentication.middleware";
import { authorizeRoles } from "../../middlewares/authorization.middleware";
import { Role } from "@prisma/client";

export class UpdateCategoryRoute implements Route {
    private constructor(
        private readonly path: string,
        private readonly method: HttpMethod,
        private readonly categoryRepository: CategoryRepository
    ) { }

    public static create(categoryRepository: CategoryRepository) {
        return new UpdateCategoryRoute(
            "/categories/:id",
            HttpMethod.PUT,
            categoryRepository
        );
    }

    public getHandler() {
        return [
            authenticate,
            authorizeRoles(Role.ADMIN),
            async (request: Request, response: Response, next: NextFunction) => {
                try {
                    const { id } = request.params;
                    const { name } = request.body;
                    const category = await this.categoryRepository.findById(id);
                    if (!category) {
                        return response.status(404).json({ message: "Categoria não encontrada." });
                    }
                    await this.categoryRepository.update(id, name);
                    response.status(200).json({ message: "Categoria atualizada com sucesso." });
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