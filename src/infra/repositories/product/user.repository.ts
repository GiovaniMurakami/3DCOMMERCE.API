import { PrismaClient } from "@prisma/client";
import { CustomerProfile, User } from "../../../domain/product/entity/user";

export class UserRepository {
  private constructor(private readonly prismaClient: PrismaClient) { }

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
        customerProfile: user.customerProfile
          ? {
            create: {
              id: user.customerProfile.id,
              address: user.customerProfile.address,
              city: user.customerProfile.city
            }
          }
          : undefined,
        password: user.password,
        createdAt: user.createdAt,
        updatedAt: user.updatedAt,
        createdBy: user.createdBy
      }
    });
  }

  async findById(id: string): Promise<User | null> {
    const user = await this.prismaClient.user.findUnique({
      where: { id },
      include: {
        customerProfile: true,
      },
    });

    if (!user) return null;

    const customerProfile = user.customerProfile
      ? new CustomerProfile(
        user.customerProfile.id,
        user.customerProfile.userId,
        user.customerProfile.address,
        user.customerProfile.city
      )
      : undefined;

    return new User(
      user.id,
      user.email,
      user.fullName,
      user.cpf,
      user.phone,
      user.role,
      user.password,
      customerProfile
    );
  }

  async findByEmail(email: string): Promise<User | null> {
    const user = await this.prismaClient.user.findUnique({
      where: { email },
      include: {
        customerProfile: true,
      },
    });

    if (!user) return null;

    const customerProfile = user.customerProfile
      ? new CustomerProfile(
        user.customerProfile.id,
        user.customerProfile.userId,
        user.customerProfile.address,
        user.customerProfile.city
      )
      : undefined;

    return new User(
      user.id,
      user.email,
      user.fullName,
      user.cpf,
      user.phone,
      user.role,
      user.password,
      customerProfile
    );
  }
}