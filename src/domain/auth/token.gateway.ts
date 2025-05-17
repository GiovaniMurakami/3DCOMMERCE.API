import { Role } from "@prisma/client";

export interface TokenGateway {
  sign(payload: object): any;
  verify(token: string): object | null | undefined;
}
export interface TokenPayload {
  userId: string;
  role: Role;
  [key: string]: any;
}