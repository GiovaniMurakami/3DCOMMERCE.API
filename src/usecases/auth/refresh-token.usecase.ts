import { TokenPayload, TokenResponse } from "../../infra/api/dto/token-response.dto";
import { JwtTokenService } from "../../infra/services/auth/jwt-token.service";

export class RefreshTokenUseCase {
  private constructor(private readonly tokenService: JwtTokenService) {}

  public static create(tokenService: JwtTokenService) {
    return new RefreshTokenUseCase(tokenService);
  }

  execute(refreshToken: string): TokenResponse {
    const decoded = this.tokenService.verify(refreshToken, process.env.JWT_REFRESH_TOKEN_SECRET!) as TokenPayload;

    return this.tokenService.generateTokens({
      userId: decoded.userId,
      userRole: decoded.userRole
    });
  }
}

