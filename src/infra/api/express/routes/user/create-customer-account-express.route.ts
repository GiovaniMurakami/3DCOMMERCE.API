import { Request, Response } from "express";
import { HttpMethod, Route } from "../route";
import { CreateCustomerAccountUseCase } from "../../../../../usecases/user/create-customer-account.usecase";

export type CreateCustomerAccountOutputDto = {
  id: string;
};

export class CreateCustomerAccountRoute implements Route {
  private constructor(
    private readonly path: string,
    private readonly method: HttpMethod,
    private readonly createUserService: CreateCustomerAccountUseCase
  ) {}

  public static create(createUserService: CreateCustomerAccountUseCase) {
    return new CreateCustomerAccountRoute(
      "/users",
      HttpMethod.POST,
      createUserService
    );
  }

  public getHandler() {
    return async (request: Request, response: Response) => {
      const output: CreateCustomerAccountOutputDto = await this.createUserService.execute(request.body);
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

  private present(input: CreateCustomerAccountOutputDto): CreateCustomerAccountOutputDto {
    const response = { id: input.id };
    return response;
  }
}