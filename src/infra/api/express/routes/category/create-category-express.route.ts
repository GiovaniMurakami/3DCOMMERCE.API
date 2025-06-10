import { Request, Response, NextFunction } from "express";
import { HttpMethod, Route } from "../route";
import { CreateCategoryUseCase } from "../../../../../usecases/category/create-category.usecase";
import { JwtTokenService } from "../../../../services/auth/jwt-token.service";
import { authenticate } from "../../middlewares/token-authentication.middleware";
import { authorizeRoles } from "../../middlewares/authorization.middleware";
import { Role } from "@prisma/client";

export class CreateCategoryRoute implements Route {
    private constructor(
        private readonly path: string,
        private readonly method: HttpMethod,
        private readonly createCategoryUseCase: CreateCategoryUseCase,
        private readonly tokenService: JwtTokenService
    ) { }

    public static create(createCategoryUseCase: CreateCategoryUseCase, tokenService: JwtTokenService) {
        return new CreateCategoryRoute(
            "/categories",
            HttpMethod.POST,
            createCategoryUseCase,
            tokenService
        );
    }

    public getHandler() {
        return [
            authenticate,
            authorizeRoles(Role.ADMIN),
            async (request: Request, response: Response, next: NextFunction) => {
                try {
                    const { name } = request.body;
                    const userRole = (request as any).tokenPayload.userRole;
                    const category = await this.createCategoryUseCase.execute({ name, userRole });
                    response.status(201).json(category);
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