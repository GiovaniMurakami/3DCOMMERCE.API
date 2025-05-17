import { Role } from "@prisma/client";
import { JwtPayload } from "jsonwebtoken";

export interface TokenGateway {
  sign(payload: TokenPayload): string;
  verify(token: string): string | JwtPayload;
}
export interface TokenPayload {
  userId: string;
  role: Role;
}