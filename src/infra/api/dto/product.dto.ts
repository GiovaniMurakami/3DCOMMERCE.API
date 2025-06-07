export interface ListProductsInputDto {
  page: number;
  limit: number;
  name?: string;
  categoryId?: string;
  categoryName?: string;
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
  price: string;
  fileUrl: string;
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
