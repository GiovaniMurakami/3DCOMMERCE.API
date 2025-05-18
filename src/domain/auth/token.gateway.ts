import { JwtPayload } from "jsonwebtoken";
import { TokenPayload, TokenResponse } from "../../infra/api/dto/token-response.dto";

export interface TokenGateway {
  sign(payload: TokenPayload, expirationTime: string, secret?: string): string;
  verify(token: string, secret: string): string | JwtPayload;
  generateTokens(payload: TokenPayload): TokenResponse;
}