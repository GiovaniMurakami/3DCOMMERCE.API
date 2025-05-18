import { Role } from "@prisma/client";

export interface TokenPayload {
  userId: string;
  userRole: Role;
}

export interface TokenResponse {
  accessToken: string;
  refreshToken: string;
}