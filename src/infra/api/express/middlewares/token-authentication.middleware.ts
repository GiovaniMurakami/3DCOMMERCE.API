import { Request, Response, NextFunction } from "express";
import { JwtTokenService } from "../../../services/auth/jwt-token.service";
import { TokenPayload } from "../../dto/token-response.dto";

export interface AuthenticatedRequest extends Request {
  tokenPayload?: TokenPayload;
}

const tokenService = new JwtTokenService();

export function authenticate(req: AuthenticatedRequest, res: Response, next: NextFunction) {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return res.status(401).json({ message: "Missing or invalid Authorization header" });
  }

  const token = authHeader.split(" ")[1];

  try {
    const decoded = tokenService.verify(token);
    req.tokenPayload = decoded as TokenPayload;
    return next();
  } catch (err) {
    return res.status(401).json({ message: "Invalid or expired token" });
  }
}
