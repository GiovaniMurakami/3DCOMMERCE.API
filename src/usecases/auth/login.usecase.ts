import { Product } from "../../domain/product/entity/product";
import { CreateProductOutputDto } from "../../infra/api/express/routes/product/create-product-express.route";
import { Usecase } from "../usecase";
import { UserRepository } from "../../infra/repositories/product/user.repository";
import { TokenGateway } from "../../domain/auth/token.gateway";

export type LoginInputDto = {
  email: string;
  password: string;
}

export class LoginUseCase implements Usecase<any, any> {
  private constructor(
    private readonly userRepository: UserRepository,
    private readonly tokenService: TokenGateway
  ) {}

  public static create(userRepository: UserRepository, tokenService: TokenGateway) {
    return new LoginUseCase(userRepository, tokenService);
  }

  public async execute(loginInputDto: LoginInputDto): Promise<any> {
    const user = await this.userRepository.findByEmail(loginInputDto.email);

    if (!user || !(await user.comparePassword(loginInputDto.password))) {
      throw new Error("Invalid credentials");
    }

    const token = this.tokenService.sign({
      userId: user.id,
      role: user.role,
    });

    return { accessToken: token };
  }
  

  private presentOutput(product: Product): CreateProductOutputDto {
    const output: CreateProductOutputDto = {
      id: product.id!,
    };

    return output;
  }
}
