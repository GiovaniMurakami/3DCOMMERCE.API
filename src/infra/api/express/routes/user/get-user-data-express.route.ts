import { Request, Response } from "express";
import { HttpMethod, Route } from "../route";
import { FindUserByIdUseCase } from "../../../../../usecases/user/find-user-by-id.usecase";
import { JwtTokenService } from "../../../../services/auth/jwt-token.service";

export class GetUserDataRoute implements Route {
    private constructor(
        private readonly path: string,
        private readonly method: HttpMethod,
        private readonly findUserByIdUseCase: FindUserByIdUseCase,
        private readonly tokenService: JwtTokenService
    ) { }

    public static create(findUserByIdUseCase: FindUserByIdUseCase, tokenService: JwtTokenService) {
        return new GetUserDataRoute(
            "/me",
            HttpMethod.GET,
            findUserByIdUseCase,
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
                    if (
                        !payload ||
                        (typeof payload !== "object") ||
                        !("userId" in payload) ||
                        typeof (payload as any).userId !== "string"
                    ) {
                        return response.status(401).json({ error: "Invalid token" });
                    }

                    const user = await this.findUserByIdUseCase.execute({ id: (payload as any).userId });
                    response.json(user);
                } catch (err) {
                    console.log(err)
                    response.status(401).json({ error: "Unauthorized" });
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