import { Request, Response, NextFunction } from "express";
import { HttpMethod, Route } from "../route";
import { CategoryRepository } from "../../../../../infra/repositories/product/category.repository";
import { authenticate } from "../../middlewares/token-authentication.middleware";
import { authorizeRoles } from "../../middlewares/authorization.middleware";
import { Role } from "@prisma/client";

export class DeleteCategoryRoute implements Route {
    private constructor(
        private readonly path: string,
        private readonly method: HttpMethod,
        private readonly categoryRepository: CategoryRepository,
    ) { }

    public static create(categoryRepository: CategoryRepository) {
        return new DeleteCategoryRoute(
            "/categories/:id",
            HttpMethod.DELETE,
            categoryRepository,
        );
    }

    public getHandler() {
        return [
            authenticate,
            authorizeRoles(Role.ADMIN),
            async (request: Request, response: Response, next: NextFunction) => {
                try {
                    const { id } = request.params;
                    const category = await this.categoryRepository.findById(id);
                    if (!category) {
                        return response.status(200).json({ message: "Categoria já foi excluída ou não existe." });
                    }

                    const hasProducts = await this.categoryRepository.hasProducts(id);
                    if (hasProducts) {
                        return response.status(400).json({ message: "Not possible to exclude" });
                    }

                    await this.categoryRepository.delete(id);
                    response.status(200).json({ message: "Categoria excluída com sucesso." });
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