import { ApiExpress } from "./infra/api/express/api.express";
import { CreateProductRoute } from "./infra/api/express/routes/product/create-product-express.route";
import { CreateCustomerAccountRoute } from "./infra/api/express/routes/user/create-customer-account-express.route";
import { ProductRepository } from "./infra/repositories/product/product.repository";
import { UserRepository } from "./infra/repositories/product/user.repository";
import AWSSimpleStorageService from "./infra/services/storage/aws-simple-storage.service";
import { prisma } from "./package/prisma/prisma";
import { CreateProductUsecase } from "./usecases/create-product/create-product.usecase";
import { CreateCustomerAccountUseCase } from "./usecases/user/create-customer-account.usecase";	
function main() {
  const productRepository = ProductRepository.create(prisma);
  const userRepository = UserRepository.create(prisma);
  const fileStorage = new AWSSimpleStorageService();

  const createProductUsecase = CreateProductUsecase.create(productRepository, fileStorage);
  const createCustomerAccountUseCase = CreateCustomerAccountUseCase.create(userRepository);

  const createProductRoute = CreateProductRoute.create(createProductUsecase);
  const createCustomerAccountRoute = CreateCustomerAccountRoute.create(createCustomerAccountUseCase);

  const api = ApiExpress.create([createProductRoute, createCustomerAccountRoute]);
  const port = 8000;
  api.start(port);
}

main();
