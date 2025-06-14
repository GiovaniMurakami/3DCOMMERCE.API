import { Role } from "@prisma/client";
import { CustomerProfile, User } from "../../domain/product/entity/user";
import { UserRepository } from "../../infra/repositories/product/user.repository";
import { Usecase } from "../usecase";
import { randomUUID } from "crypto";
import { generatePasswordHash } from "../../utils/password.utils";
import { CreateCustomerAccountOutputDto } from "../../infra/api/express/routes/user/create-customer-account-express.route";

export type CreateCustomerAccountInputDto = {
  email: string;
  fullName: string;
  cpf: string;
  phone: string;
  password: string;
  customerProfile: CustomerProfileInputDto;
}

export type CustomerProfileInputDto = {
  address: string;
  city: string;
}

export class CreateCustomerAccountUseCase implements Usecase<CreateCustomerAccountInputDto, CreateCustomerAccountOutputDto> {
  private constructor(
    private readonly userRepository: UserRepository,
  ) { }

  public static create(userRepository: UserRepository) {
    return new CreateCustomerAccountUseCase(userRepository);
  }

  public async execute(createCustomerAccountInputDto: CreateCustomerAccountInputDto) {
    const userId = randomUUID();
    const passwordHash = await generatePasswordHash(createCustomerAccountInputDto.password);

    const userEntity: User = new User(
      userId,
      createCustomerAccountInputDto.email,
      createCustomerAccountInputDto.fullName,
      Role.CUSTOMER,
      passwordHash
    );
    await this.userRepository.save(userEntity);
    return this.presentOutput(userEntity);
  }

  private presentOutput(user: User): CreateCustomerAccountOutputDto {
    const output: CreateCustomerAccountOutputDto = {
      id: user.id
    };
    return output;
  }
}