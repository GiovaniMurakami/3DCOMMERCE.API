import { Role } from "@prisma/client";

export interface TokenGateway {
  sign(payload: TokenPayload): string;
  verify(token: string): object | null | undefined;
}
export interface TokenPayload {
  userId: string;
  role: Role;
}