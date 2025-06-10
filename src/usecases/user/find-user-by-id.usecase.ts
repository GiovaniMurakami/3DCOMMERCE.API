import { UserRepository } from "../../infra/repositories/product/user.repository";
import { User } from "../../domain/product/entity/user";
import { Usecase } from "../usecase";

export type FindUserByIdInputDto = {
    id: string;
};

export type FindUserByIdOutputDto = {
    id: string;
    fullName: string;
    email: string;
    cpf: string;
    phone: string;
    role: string;
    customerProfile?: {
        address: string;
        city: string;
    };
};

export class FindUserByIdUseCase implements Usecase<FindUserByIdInputDto, FindUserByIdOutputDto> {
    private constructor(private readonly userRepository: UserRepository) { }

    public static create(userRepository: UserRepository) {
        return new FindUserByIdUseCase(userRepository);
    }

    public async execute(input: FindUserByIdInputDto): Promise<FindUserByIdOutputDto> {
        const user = await this.userRepository.findById(input.id);
        if (!user) throw new Error("User not found");
        return {
            id: user.id,
            fullName: user.fullName,
            email: user.email,
            cpf: user.cpf,
            phone: user.phone,
            role: user.role,
            customerProfile: user.customerProfile
                ? {
                    address: user.customerProfile.address,
                    city: user.customerProfile.city,
                }
                : undefined,
        };
    }
}