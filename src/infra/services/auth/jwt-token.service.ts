import jwt from 'jsonwebtoken';

export const env = {
  jwtSecret: process.env.JWT_SECRET
};

class JwtTokenService implements TokenService {
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