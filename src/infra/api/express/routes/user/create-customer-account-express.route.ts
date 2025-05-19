import { Request, Response } from "express";
import { HttpMethod, Route } from "../route";
import { CreateCustomerAccountUseCase } from "../../../../../usecases/user/create-customer-account.usecase";
import { createCustomerAccountValidator } from "./validation/create-customer-account.validation";
import { expressValidatorHandler } from "../../middlewares/exporess-validator-handler.middleware";
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
    return [
      ...createCustomerAccountValidator,
      expressValidatorHandler,
      async (request: Request, response: Response) => {
        const output = await this.createUserService.execute(request.body);
        const responseBody = await this.present(output);
        response.status(201).json(responseBody);
      },
    ];
  }

  public getPath(): string {
    return this.path;
  }

  public getMethod(): HttpMethod {
    return this.method;
  }

  private present(input: CreateCustomerAccountOutputDto): any {
    return input;
  }
}