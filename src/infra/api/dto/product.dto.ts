import Decimal from "decimal.js";

export interface ListProductsInputDto {
  page: number;
  limit: number;
  name?: string;
  categoryId?: string;
  categoryName?: string;
  sortBy?: string;
  sortDir?: "asc" | "desc";
}

export interface ProductListItemDto  {
  id: string;
  name: string;
  price: number;
  fileUrl: string;
  mainImageUrl: string;
  categoryName: string;
}

export interface ListProductsOutputDto {
  data: ProductListItemDto [];
  total: number;
  page: number;
  limit: number;
}

export interface ProductOutputDto {
  id: string;
  name: string;
  price: Decimal;
  fileUrl: string;
  description: string;
  createdBy: string;
  categoryId: string;
  createdAt?: Date;
  updatedAt?: Date;
  category?: {
    id: string;
    name: string;
  };
  productImages?: {
    id: string;
    url: string;
    type: string;
  }[];
}
