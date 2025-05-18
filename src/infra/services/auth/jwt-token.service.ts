import jwt, { JwtPayload, SignOptions } from 'jsonwebtoken';
import { TokenGateway, } from '../../../domain/auth/token.gateway';
import { StringValue } from "ms";
import { TokenPayload, TokenResponse } from '../../api/dto/token-response.dto';

export class JwtTokenService implements TokenGateway {
sign(
    payload: TokenPayload,
    expirationTime: StringValue, 
    secret: string 
  ): string {
    const jwtOptions: SignOptions = {
      expiresIn: expirationTime,
    };
    
    return jwt.sign(payload, secret, jwtOptions);
  }

  verify(token: string, secret?: string): string | JwtPayload {
    return jwt.verify(token, secret || process.env.JWT_ACCESS_TOKEN_SECRET!);
  }

  generateTokens(payload: TokenPayload): TokenResponse {
    const accessToken = this.sign(payload, "1h", process.env.JWT_ACCESS_TOKEN_SECRET!);
    const refreshToken = this.sign(payload, "7d", process.env.JWT_ACCESS_TOKEN_SECRET!);

    return {
      accessToken,
      refreshToken
    };
  }
}