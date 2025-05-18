import { Product } from "./product";

export class ProductImage {
  constructor(
    public id: string,
    public url: string,
    public type: string,
    public productId: string
  ) {}
}