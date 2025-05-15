import { Role } from "@prisma/client";
import { CustomerProfile, User } from "../../domain/product/entity/user";
import { UserRepository } from "../../infra/repositories/product/user.repository";
import { Usecase } from "../usecase";
import { randomUUID } from "crypto";

export type CreateCustomerAccountInputDto = {
  email: string;
  fullName: string;
  cpf: string;
  phone: string;
  password: string;
  createdAt: Date;
  updatedAt: Date;
  customerProfile: CustomerProfile;
  createdBy?: string;
}
// role and id
export class CreateCustomerAccountUseCase implements Usecase<CreateCustomerAccountInputDto, any> {
  private constructor(
    private readonly userRepository: UserRepository,
  ) {}

  public static create(userRepository: UserRepository) {
      return new CreateCustomerAccountUseCase(userRepository);
    }

  public async execute(createCustomerAccountInputDto: CreateCustomerAccountInputDto): Promise<any> {
    const userEntity: User = new User (
      randomUUID(),
      createCustomerAccountInputDto.email,
      createCustomerAccountInputDto.fullName,
      createCustomerAccountInputDto.cpf,
      createCustomerAccountInputDto.phone,
      Role.CUSTOMER,
      createCustomerAccountInputDto.password,
      createCustomerAccountInputDto.createdAt,
      createCustomerAccountInputDto.updatedAt,
      createCustomerAccountInputDto.customerProfile
    )
    this.userRepository.save(userEntity);
  }
}