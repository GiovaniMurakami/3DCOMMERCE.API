import jwt from 'jsonwebtoken';
import { TokenGateway } from '../../../domain/auth/token.gateway';

export const env = {
  jwtSecret: process.env.JWT_SECRET
};

export class JwtTokenService implements TokenGateway {
  sign(payload: object): string {
    return jwt.sign(payload, env.jwtSecret!, { expiresIn: '3h' });
  }

  verify(token: string): object | null | undefined {
    try {
      jwt.verify(token, env.jwtSecret!);
    } catch {
      return null;
    }
  }
}