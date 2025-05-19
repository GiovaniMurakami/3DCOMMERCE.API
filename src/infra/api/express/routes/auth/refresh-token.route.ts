import { RefreshTokenUseCase } from "../../../../../usecases/auth/refresh-token.usecase";
import { expressValidatorHandler } from "../../middlewares/exporess-validator-handler.middleware";
import { HttpMethod, Route } from "../route";
import { Request, Response } from "express";

export interface RefreshTokenInputDto {
  refreshToken: string
}

export class RefreshTokenRoute implements Route {
  constructor(
    private readonly refreshTokenUseCase: RefreshTokenUseCase
  ) {}

  static create(usecase: RefreshTokenUseCase) {
    return new RefreshTokenRoute(usecase);
  }

  getPath(): string {
    return "/refresh-token";
  }

  getMethod(): HttpMethod {
    return HttpMethod.POST;
  }

  getHandler() {
    return [
      expressValidatorHandler,
      async (req: Request, res: Response) => {
      const { refreshToken } = req.body;

      if (!refreshToken) {
        return res.status(400).json({ message: "Refresh token is required" });
      }
      try {
        const result = this.refreshTokenUseCase.execute(refreshToken);
        return res.status(200).json(result);
      } catch (err) {
        return res.status(401).json({ message: "Invalid or expired refresh token" });
      }
    }];
  }
}
