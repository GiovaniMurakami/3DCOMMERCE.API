import { User } from "@prisma/client";

export interface UserGateway {
  save(user: User): Promise<void>;
}