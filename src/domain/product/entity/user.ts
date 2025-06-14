import { Role } from "@prisma/client";

export class User {
  constructor(
    public id: string,
    public email: string,
    public fullName: string,
    public role: Role,
    public password: string,
    public cpf?: string,
    public phone?: string,
    public customerProfile?: CustomerProfile,
    public createdAt?: Date,
    public updatedAt?: Date,
    public createdBy?: string
  ) {}
}

export class CustomerProfile {
  constructor(
    public id: string,
    public userId: string,
    public address: string,
    public city: string,
    public user?: User
  ) {}
}