import { ApiExpress } from "./infra/api/express/api.express";
import { CreateProductRoute } from "./infra/api/express/routes/product/create-product-express.route";
import { ListProductRoute } from "./infra/api/express/routes/product/list-product.express.route";
import { ProductRepository } from "./infra/repositories/product/product.repository";
import AWSSimpleStorageService from "./infra/storage/aws-simple-storage.service";
import { prisma } from "./package/prisma/prisma";
import { CreateProductUsecase } from "./usecases/create-product/create-product.usecase";
import { ListProductUsecase } from "./usecases/list-product/list-product.usecase";

function main() {
  const aRepository = ProductRepository.create(prisma);
  const fileStorage = new AWSSimpleStorageService();

  const createProductUsecase = CreateProductUsecase.create(aRepository, fileStorage);
  const listProductUsecase = ListProductUsecase.create(aRepository);

  const createRoute = CreateProductRoute.create(createProductUsecase);
  const listRoute = ListProductRoute.create(listProductUsecase);

  const api = ApiExpress.create([createRoute, listRoute]);
  const port = 8000;
  api.start(port);
}

main();
