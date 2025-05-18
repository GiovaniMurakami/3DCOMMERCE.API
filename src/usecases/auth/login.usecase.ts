import { Usecase } from "../usecase";
import { UserRepository } from "../../infra/repositories/product/user.repository";
import { TokenGateway } from "../../domain/auth/token.gateway";
import { comparePassword } from "../../utils/password.utils";
import { TokenResponse } from "../../infra/api/dto/token-response.dto";

export type LoginInputDto = {
  email: string;
  password: string;
}

export class LoginUseCase implements Usecase<any, any> {
  private constructor(
    private readonly userRepository: UserRepository,
    private readonly tokenService: TokenGateway
  ) { }

  public static create(userRepository: UserRepository, tokenService: TokenGateway) {
    return new LoginUseCase(userRepository, tokenService);
  }

  public async execute(loginInputDto: LoginInputDto): Promise<TokenResponse> {
    const user = await this.userRepository.findByEmail(loginInputDto.email);

    if (!user || !(await comparePassword(loginInputDto.password, user.password))) {
      throw new Error("Invalid credentials");
    }

    return this.tokenService.generateTokens({userId: user.id, userRole: user.role});
  }
}
