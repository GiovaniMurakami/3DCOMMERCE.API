// src/usecases/user/find-user-by-email.usecase.ts

import { User } from "../../domain/product/entity/user";
import { UserRepository } from "../../infra/repositories/product/user.repository";
import { Usecase } from "../usecase";

export type FindUserByEmailInputDto = {
  email: string;
};

export type FindUserOutputDto = {
  id: string;
  fullName: string;
  email: string;
  cpf: string;
  phone: string;
  role: string;
  customerProfile?: {
    address: string;
    city: string;
  };
};

export class FindUserByEmailUseCase implements Usecase<FindUserByEmailInputDto, FindUserOutputDto> {
  private constructor(
    private readonly userRepository: UserRepository
  ) {}

  public static create(userRepository: UserRepository) {
    return new FindUserByEmailUseCase(userRepository);
  }

  public async execute(input: FindUserByEmailInputDto): Promise<FindUserOutputDto> {
    const user = await this.userRepository.findByEmail(input.email);

    if (!user) {
      throw new Error("User not found");
    }

    return this.presentOutput(user);
  }

  private presentOutput(user: User): FindUserOutputDto {
    return {
      id: user.id,
      fullName: user.fullName,
      email: user.email,
      cpf: user.cpf,
      phone: user.phone,
      role: user.role,
      customerProfile: user.customerProfile
        ? {
            address: user.customerProfile.address,
            city: user.customerProfile.city,
          }
        : undefined,
    };
  }
}
