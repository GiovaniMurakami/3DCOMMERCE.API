import { NextFunction, Request, Response } from "express";
import { UpdateProductInputDto, UpdateProductUsecase } from "../../../../../usecases/product/update-product.usecase";
import { HttpMethod, Route } from "../route";
import { authenticate } from "../../middlewares/token-authentication.middleware";
import { authorizeRoles } from "../../middlewares/authorization.middleware";
import { Role } from "@prisma/client";
import { CreateProductImageInputDto } from "../../../../../usecases/product/create-product.usecase";
import Decimal from "decimal.js";

export class UpdateProductRoute implements Route {
  private constructor(
    private readonly path: string,
    private readonly method: HttpMethod,
    private readonly updateProductService: UpdateProductUsecase
  ) {}

  public static create(updateProductService: UpdateProductUsecase) {
    return new UpdateProductRoute(
      "/products/:id",
      HttpMethod.PUT,
      updateProductService
    );
  }

  public getHandler() {
    return [
      authenticate,
      authorizeRoles(Role.ADMIN),
      async (request: Request, response: Response, next: NextFunction) => {
        try {
          const files = request.files as Express.Multer.File[];
          const modelFile = files.find((file) => file.fieldname === "model");
          const images = this.mapRequestToImageInputDto(request, files);

          const input: UpdateProductInputDto = {
            id: request.params.id,
            name: request.body.name,
            price: new Decimal(request.body.price),
            description: request.body.description,
            categoryId: request.body.categoryId,
            model: modelFile?.buffer,
            images,
            userId: (request as any).tokenPayload.userId,
          };

          await this.updateProductService.execute(input);
          response.status(204).send();
        } catch (err) {
          next(err);
        }
      }
    ];
  }

  public getPath(): string {
    return this.path;
  }

  public getMethod(): HttpMethod {
    return this.method;
  }

  private mapRequestToImageInputDto(
    request: Request,
    files: Express.Multer.File[]
  ): CreateProductImageInputDto[] {
    const images: CreateProductImageInputDto[] = [];

    files
      .filter((file) => file.fieldname.startsWith("images["))
      .forEach((file) => {
        const match = file.fieldname.match(/images\[(\d+)\]\.image/);
        if (match) {
          const index = parseInt(match[1], 10);
          const type = request.body[`images[${index}].type`];
          images[index] = {
            name: file.originalname,
            image: file.buffer,
            type,
          };
        }
      });

    return images;
  }
}
