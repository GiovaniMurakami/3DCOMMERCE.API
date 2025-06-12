import { ApiExpress } from "./infra/api/express/api.express";
import { LoginRoute } from "./infra/api/express/routes/auth/login.route";
import { RefreshTokenRoute } from "./infra/api/express/routes/auth/refresh-token.route";
import { ListCategoriesRoute } from "./infra/api/express/routes/category/list-categories-express.route";
import { CreateProductRoute } from "./infra/api/express/routes/product/create-product-express.route";
import { DeleteProductRoute } from "./infra/api/express/routes/product/delete-product-express.route";
import { GetProductByIdRoute } from "./infra/api/express/routes/product/get-product-by-id-express.route";
import { ListProductsRoute } from "./infra/api/express/routes/product/list-product-express.route";
import { UpdateProductRoute } from "./infra/api/express/routes/product/update-product-express.route";
import { CreateCustomerAccountRoute } from "./infra/api/express/routes/user/create-customer-account-express.route";
import { CreateCategoryUseCase } from "./usecases/category/create-category.usecase";
import { CreateCategoryRoute } from "./infra/api/express/routes/category/create-category-express.route";
import { CategoryRepository } from "./infra/repositories/product/category.repository";
import { FindUserByIdUseCase } from "./usecases/user/find-user-by-id.usecase";
import { DeleteCategoryRoute } from "./infra/api/express/routes/category/delete-category-express.route";
import { UpdateCategoryRoute } from "./infra/api/express/routes/category/update-category-express.route";

import { GetUserDataRoute } from "./infra/api/express/routes/user/get-user-data-express.route";
import { ProductRepository } from "./infra/repositories/product/product.repository";
import { UserRepository } from "./infra/repositories/product/user.repository";
import { JwtTokenService } from "./infra/services/auth/jwt-token.service";
import AWSSimpleStorageService from "./infra/services/storage/aws-simple-storage.service";
import { prisma } from "./package/prisma/prisma";
import { LoginUseCase } from "./usecases/auth/login.usecase";
import { RefreshTokenUseCase } from "./usecases/auth/refresh-token.usecase";
import { CreateProductUsecase } from "./usecases/product/create-product.usecase";
import { DeleteProductUsecase } from "./usecases/product/delete-product.usecase";
import { GetProductByIdUseCase } from "./usecases/product/find-product-by-id.usecase";
import { ListCategoriesUseCase } from "./usecases/product/list-categories.usecase";
import { ListProductsUseCase } from "./usecases/product/list-products.usecase";
import { UpdateProductUsecase } from "./usecases/product/update-product.usecase";
import { CreateCustomerAccountUseCase } from "./usecases/user/create-customer-account.usecase";
import { OrderRepository } from "./infra/repositories/order/order.repository";
import { CreateOrderUsecase } from "./usecases/order/create-order.usecase";
import { CreateOrderRoute } from "./infra/api/express/routes/order/create-order-express.route";
import { ListOrdersRoute } from "./infra/api/express/routes/order/list-orders-express.route";
import { ListOrdersUsecase } from "./usecases/order/list-order.usecase";
import { UpdateOrderAdminUsecase } from "./usecases/order/update-order-admin.usecase";
import { UpdateOrderAdminRoute } from "./infra/api/express/routes/order/update-order-admin-express.route";

function main() {
  const productRepository = ProductRepository.create(prisma);
  const userRepository = UserRepository.create(prisma);
  const categoryRepository = CategoryRepository.create(prisma);
  const orderRepository = OrderRepository.create(prisma);

  const fileStorage = new AWSSimpleStorageService();
  const tokenService = new JwtTokenService();
  const createOrderUsecase = CreateOrderUsecase.create(orderRepository);
  const createProductUsecase = CreateProductUsecase.create(productRepository, fileStorage);
  const updateProductUsecase = UpdateProductUsecase.create(productRepository, fileStorage);
  const deleteProductUsecase = DeleteProductUsecase.create(productRepository, fileStorage);
  const updateOrderAdminUsecase = UpdateOrderAdminUsecase.create(orderRepository);
  const createCustomerAccountUseCase = CreateCustomerAccountUseCase.create(userRepository);
  const loginUseCase = LoginUseCase.create(userRepository, tokenService);
  const refreshTokenUseCase = RefreshTokenUseCase.create(tokenService);
  const listProductsUseCase = ListProductsUseCase.create(productRepository);
  const getProductByIdUseCase = GetProductByIdUseCase.create(productRepository);
  const listCategoriesUseCase = ListCategoriesUseCase.create(categoryRepository);
  const listOrdersUsecase = ListOrdersUsecase.create(orderRepository);
  const findUserByIdUseCase = FindUserByIdUseCase.create(userRepository);
  const getUserDataRoute = GetUserDataRoute.create(findUserByIdUseCase, tokenService);

  const createCategoryUseCase = CreateCategoryUseCase.create(categoryRepository);
  const createCategoryRoute = CreateCategoryRoute.create(createCategoryUseCase, tokenService);
  const deleteCategoryRoute = DeleteCategoryRoute.create(categoryRepository);
  const updateCategoryRoute = UpdateCategoryRoute.create(categoryRepository);
  const listOrdersRoute = ListOrdersRoute.create(listOrdersUsecase);

  const createProductRoute = CreateProductRoute.create(createProductUsecase);
  const updateProductRoute = UpdateProductRoute.create(updateProductUsecase);
  const deleteProductRoute = DeleteProductRoute.create(deleteProductUsecase);
  const createCustomerAccountRoute = CreateCustomerAccountRoute.create(createCustomerAccountUseCase);
  const loginRoute = LoginRoute.create(loginUseCase);
  const refreshTokenRoute = RefreshTokenRoute.create(refreshTokenUseCase);
  const listProductsRoute = ListProductsRoute.create(listProductsUseCase);
  const getProductByIdRoute = GetProductByIdRoute.create(getProductByIdUseCase);
  const listCategoriesRoute = ListCategoriesRoute.create(listCategoriesUseCase);
  const createOrderRoute = CreateOrderRoute.create(createOrderUsecase);
  const updateOrderAdminRoute = UpdateOrderAdminRoute.create(updateOrderAdminUsecase);

  const api = ApiExpress.create([
    createProductRoute,
    updateProductRoute,
    deleteProductRoute,
    createCustomerAccountRoute,
    loginRoute,
    refreshTokenRoute,
    listProductsRoute,
    getProductByIdRoute,
    listCategoriesRoute,
    getUserDataRoute,
    createCategoryRoute,
    deleteCategoryRoute,
    updateCategoryRoute,
    createCategoryRoute,
    createOrderRoute,
    listOrdersRoute,
    updateOrderAdminRoute
  ]);

  const port = 8000;
  api.start(port);
}

main();