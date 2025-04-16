import { Product } from "./product";

export class Category {
  constructor(
    public id: string,
    public name: string,
    public createdAt: Date,
    public updatedAt: Date,
    public products?: Product[]
  ) {}
}