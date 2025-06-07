import { Request, Response } from "express";
import { HttpMethod, Route } from "../route";
import { expressValidatorHandler } from "../../middlewares/exporess-validator-handler.middleware";
import { LoginInputDto } from "../../../../../usecases/auth/login.usecase";

export class LoginRoute implements Route {
  private constructor(
    private readonly path: string,
    private readonly method: HttpMethod,
    private readonly authenticateUseCase: any
  ) { }

  public static create(authenticateUseCase: any) {
    return new LoginRoute(
      "/login",
      HttpMethod.POST,
      authenticateUseCase
    );
  }

  public getHandler() {
    return [
      expressValidatorHandler,
      async (req: Request, res: Response) => {
        const loginInputDto: LoginInputDto = req.body;

        try {
          const result = await this.authenticateUseCase.execute(loginInputDto);
          return res.status(200).json(result);
        } catch (error: any) {
          return res.status(401).json({ message: error.message || "Invalid credentials" });
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