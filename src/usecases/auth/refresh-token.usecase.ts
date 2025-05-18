import { TokenPayload, TokenResponse } from "../../infra/api/dto/token-response.dto";
import { JwtTokenService } from "../../infra/services/auth/jwt-token.service";

export class RefreshTokenUseCase {
  constructor(private readonly tokenService: JwtTokenService) {}

  execute(refreshToken: string): TokenResponse {
    const decoded = this.tokenService.verify(refreshToken) as TokenPayload;

    return this.tokenService.generateTokens({
      userId: decoded.userId,
      userRole: decoded.userRole
    });
  }
}

