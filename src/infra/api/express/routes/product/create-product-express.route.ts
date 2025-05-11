import { Request, Response } from "express";
import {
  CreateProductImageInputDto,
  CreateProductInputDto,
  CreateProductUsecase,
} from "../../../../../usecases/create-product/create-product.usecase";
import { HttpMethod, Route } from "../route";
import Decimal from "decimal.js";

export type CreateProductOutputDto = {
  id: string;
};

export class CreateProductRoute implements Route {
  private constructor(
    private readonly path: string,
    private readonly method: HttpMethod,
    private readonly createProductService: CreateProductUsecase
  ) {}

  public static create(createProductService: CreateProductUsecase) {
    return new CreateProductRoute(
      "/products",
      HttpMethod.POST,
      createProductService
    );
  }

  public getHandler() {
    return async (request: Request, response: Response) => {
      const files = request.files as Express.Multer.File[];
      const modelFile = files.find((file) => file.fieldname === "model");
      console.log(files);
      const images = this.mapRequestToImageInputDto(request, files);
      const input: CreateProductInputDto = {
        name: request.body.name,
        price: new Decimal(request.body.price),
        categoryId: request.body.categoryId,
        model: modelFile?.buffer ?? Buffer.from([]),
        images,
      };
  
      const output: CreateProductOutputDto = await this.createProductService.execute(input);
      const responseBody = this.present(output);
      response.status(201).json(responseBody);
    };
  }

  public getPath(): string {
    return this.path;
  }

  public getMethod(): HttpMethod {
    return this.method;
  }

  private present(input: CreateProductOutputDto): CreateProductOutputDto {
    const response = { id: input.id };
    return response;
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