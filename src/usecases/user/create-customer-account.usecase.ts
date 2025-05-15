import { Role } from "@prisma/client";
import { CustomerProfile, User } from "../../domain/product/entity/user";
import { UserRepository } from "../../infra/repositories/product/user.repository";
import { Usecase } from "../usecase";
import { randomUUID } from "crypto";
import { generatePasswordHash } from "../../utils/password.utils";

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

export class CreateCustomerAccountUseCase implements Usecase<CreateCustomerAccountInputDto, any> {
  private constructor(
    private readonly userRepository: UserRepository,
  ) {}

  public static create(userRepository: UserRepository) {
      return new CreateCustomerAccountUseCase(userRepository);
    }

  public async execute(createCustomerAccountInputDto: CreateCustomerAccountInputDto): Promise<any> {
    const userId = randomUUID();
    const passwordHash = await generatePasswordHash(createCustomerAccountInputDto.password);

    const userEntity: User = new User (
      userId,
      createCustomerAccountInputDto.email,
      createCustomerAccountInputDto.fullName,
      createCustomerAccountInputDto.cpf,
      createCustomerAccountInputDto.phone,
      Role.CUSTOMER,
      passwordHash,
      createCustomerAccountInputDto.createdAt,
      createCustomerAccountInputDto.updatedAt,
      createCustomerAccountInputDto.customerProfile
    );
    this.userRepository.save(userEntity);
  }
}