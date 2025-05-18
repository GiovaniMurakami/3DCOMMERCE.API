import { ApiExpress } from "./infra/api/express/api.express";
import { LoginRoute } from "./infra/api/express/routes/auth/login.route";
import { CreateProductRoute } from "./infra/api/express/routes/product/create-product-express.route";
import { CreateCustomerAccountRoute } from "./infra/api/express/routes/user/create-customer-account-express.route";
import { ProductRepository } from "./infra/repositories/product/product.repository";
import { UserRepository } from "./infra/repositories/product/user.repository";
import { JwtTokenService } from "./infra/services/auth/jwt-token.service";
import AWSSimpleStorageService from "./infra/services/storage/aws-simple-storage.service";
import { prisma } from "./package/prisma/prisma";
import { LoginUseCase } from "./usecases/auth/login.usecase";
import { CreateProductUsecase } from "./usecases/create-product/create-product.usecase";
import { CreateCustomerAccountUseCase } from "./usecases/user/create-customer-account.usecase";	
import dotenv from 'dotenv';

function main() {
  dotenv.config();
  const productRepository = ProductRepository.create(prisma);
  const userRepository = UserRepository.create(prisma);
  const fileStorage = new AWSSimpleStorageService();
  const tokenService = new JwtTokenService();

  const createProductUsecase = CreateProductUsecase.create(productRepository, fileStorage);
  const createCustomerAccountUseCase = CreateCustomerAccountUseCase.create(userRepository);
  const loginUseCase = LoginUseCase.create(userRepository, tokenService);

  const createProductRoute = CreateProductRoute.create(createProductUsecase);
  const createCustomerAccountRoute = CreateCustomerAccountRoute.create(createCustomerAccountUseCase);
  const loginRoute = LoginRoute.create(loginUseCase);

  const api = ApiExpress.create([createProductRoute, createCustomerAccountRoute, loginRoute]);
  const port = 8000;
  api.start(port);
}

main();
