// src/routes/middlewares/authenticate-jwt.ts
import { Request, Response, NextFunction } from "express";
import { TokenPayload } from "../../../../domain/auth/token.gateway";
import { JwtTokenService } from "../../../services/auth/jwt-token.service";

export interface AuthenticatedRequest extends Request {
  user?: TokenPayload;
}

const tokenService = new JwtTokenService();

export function authenticate(req: Request, res: Response, next: NextFunction) {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return res.status(401).json({ message: "Missing or invalid Authorization header" });
  }

  const token = authHeader.split(" ")[1];

  try {
    const decoded = tokenService.verify(token);
    (req as AuthenticatedRequest).user = decoded as TokenPayload;
    next();
  } catch (err) {
    return res.status(401).json({ message: "Invalid or expired token" });
  }
}
