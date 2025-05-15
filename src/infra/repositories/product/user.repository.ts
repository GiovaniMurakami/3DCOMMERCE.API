import { Prisma, PrismaClient } from "@prisma/client";
import { User } from "../../../domain/product/entity/user";


export class UserRepository {
  private constructor(private readonly prismaClient: PrismaClient) {}

  public static create(prismaClient: PrismaClient) {
    return new UserRepository(prismaClient);
  }

  public async save(user: User) {
    await this.prismaClient.user.create({
      data: {
        id: user.id,
        email: user.email,
        fullName: user.fullName,
        cpf: user.cpf,
        phone: user.phone,
        role: user.role,
        password: user.password,
        createdAt: user.createdAt,
        updatedAt: user.updatedAt,
        createdBy: user.createdBy
      }
    });
  }
}