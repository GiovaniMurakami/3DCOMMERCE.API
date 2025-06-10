import { ApiExpress } from "./infra/api/express/api.express";
import { LoginRoute } from "./infra/api/express/routes/auth/login.route";
import { RefreshTokenRoute } from "./infra/api/express/routes/auth/refresh-token.route";
import { ListCategoriesRoute } from "./infra/api/express/routes/category/list-categories-express.route";
import { CreateProductRoute } from "./infra/api/express/routes/product/create-product-express.route";
import { GetProductByIdRoute } from "./infra/api/express/routes/product/get-product-by-id-express.route";
import { ListProductsRoute } from "./infra/api/express/routes/product/list-product-express.route";
import { CreateCustomerAccountRoute } from "./infra/api/express/routes/user/create-customer-account-express.route";
import { CategoryRepository } from "./infra/repositories/product/category.repository";
import { FindUserByIdUseCase } from "./usecases/user/find-user-by-id.usecase";
import { GetUserDataRoute } from "./infra/api/express/routes/user/get-user-data-express.route";
import { ProductRepository } from "./infra/repositories/product/product.repository";
import { UserRepository } from "./infra/repositories/product/user.repository";
import { JwtTokenService } from "./infra/services/auth/jwt-token.service";
import AWSSimpleStorageService from "./infra/services/storage/aws-simple-storage.service";
import { prisma } from "./package/prisma/prisma";
import { LoginUseCase } from "./usecases/auth/login.usecase";
import { RefreshTokenUseCase } from "./usecases/auth/refresh-token.usecase";
import { CreateProductUsecase } from "./usecases/product/create-product.usecase";
import { GetProductByIdUseCase } from "./usecases/product/find-product-by-id.usecase";
import { ListCategoriesUseCase } from "./usecases/product/list-categories.usecase";
import { ListProductsUseCase } from "./usecases/product/list-products.usecase";
import { CreateCustomerAccountUseCase } from "./usecases/user/create-customer-account.usecase";

function main() {
  const productRepository = ProductRepository.create(prisma);
  const userRepository = UserRepository.create(prisma);
  const categoryRepository = CategoryRepository.create(prisma);

  const fileStorage = new AWSSimpleStorageService();
  const tokenService = new JwtTokenService();

  const createProductUsecase = CreateProductUsecase.create(productRepository, fileStorage);
  const createCustomerAccountUseCase = CreateCustomerAccountUseCase.create(userRepository);
  const loginUseCase = LoginUseCase.create(userRepository, tokenService);
  const refreshTokenUseCase = RefreshTokenUseCase.create(tokenService);
  const listProductsUseCase = ListProductsUseCase.create(productRepository);
  const getProductByIdUseCase = GetProductByIdUseCase.create(productRepository);
  const listCategoriesUseCase = ListCategoriesUseCase.create(categoryRepository);

  const findUserByIdUseCase = FindUserByIdUseCase.create(userRepository);
  const getUserDataRoute = GetUserDataRoute.create(findUserByIdUseCase, tokenService);

  const createProductRoute = CreateProductRoute.create(createProductUsecase);
  const createCustomerAccountRoute = CreateCustomerAccountRoute.create(createCustomerAccountUseCase);
  const loginRoute = LoginRoute.create(loginUseCase);
  const refreshTokenRoute = RefreshTokenRoute.create(refreshTokenUseCase);
  const listProductsRoute = ListProductsRoute.create(listProductsUseCase);
  const getProductByIdRoute = GetProductByIdRoute.create(getProductByIdUseCase);
  const listCategoriesRoute = ListCategoriesRoute.create(listCategoriesUseCase);

  const api = ApiExpress.create([createProductRoute, createCustomerAccountRoute, loginRoute, refreshTokenRoute, listProductsRoute, getProductByIdRoute, listCategoriesRoute, getUserDataRoute]);
  const port = 8000;
  api.start(port);
}

main();
