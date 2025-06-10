import { Request, Response } from "express";
import { HttpMethod, Route } from "../route";
import { CreateCategoryUseCase } from "../../../../../usecases/category/create-category.usecase";
import { JwtTokenService } from "../../../../services/auth/jwt-token.service";

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
            async (request: Request, response: Response) => {
                try {
                    const authHeader = request.headers.authorization;
                    if (!authHeader) return response.status(401).json({ error: "Token missing" });

                    const token = authHeader.replace("Bearer ", "");
                    const payload = this.tokenService.verify(token);
                    const userRole = (payload as any).userRole;

                    const { name } = request.body;
                    const category = await this.createCategoryUseCase.execute({ name, userRole });
                    response.status(201).json(category);
                } catch (err) {
                    response.status(400).json({ error: (err as Error).message });
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