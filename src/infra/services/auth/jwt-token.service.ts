import jwt from 'jsonwebtoken';
import { TokenGateway, TokenPayload } from '../../../domain/auth/token.gateway';

export class JwtTokenService implements TokenGateway {
  sign(tokenPayload: TokenPayload): string {
    return jwt.sign({tokenPayload}, process.env.JWT_SECRET!, { expiresIn: '1h' });
  }

  verify(token: string): object | null | undefined {
    try {
      jwt.verify(token, process.env.JWT_SECRET!);
    } catch {
      return null;
    }
  }
}