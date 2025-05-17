import Decimal from "decimal.js";
import { Product } from "../../domain/product/entity/product";
import { CreateProductOutputDto } from "../../infra/api/express/routes/product/create-product-express.route";
import { ProductRepository } from "../../infra/repositories/product/product.repository";
import { Usecase } from "../usecase";
import { randomUUID } from "crypto";
import { StorageGateway } from "../../domain/storage/storage.gateway";
import { ProductImage } from "../../domain/product/entity/product-image";
import { UserRepository } from "../../infra/repositories/product/user.repository";

export type LoginInputDto = {
  email: string;
  password: string;
}

export class CreateProductUsecase implements Usecase<any, any> {
  private constructor(
    private readonly userRepository: UserRepository,
    private readonly tokenService: TokenService
  ) {}

  public static create(userRepository: UserRepository, tokenService: TokenService) {
    return new CreateProductUsecase(userRepository, tokenService);
  }

  public async execute(loginInputDto: LoginInputDto): Promise<any> {
    this.tokenService.sign(loginInputDto);
  }
  

  private presentOutput(product: Product): CreateProductOutputDto {
    const output: CreateProductOutputDto = {
      id: product.id!,
    };

    return output;
  }
}
