import Decimal from "decimal.js";
import { ProductImage } from "./product-image";
import { Category } from "./category";

export class Product {
  public readonly createdAt?: Date;
  public updatedAt?: Date;
  public productImages?: ProductImage[];
  public category?: Category;

  constructor(
    public id: string,
    public name: string,
    public price: Decimal,
    public fileUrl: string,
    public createdBy: string,
    public categoryId: string,
  ) {
  }
}
