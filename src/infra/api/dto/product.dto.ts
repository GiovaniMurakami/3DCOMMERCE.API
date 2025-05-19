export interface ListProductsInputDto {
  page: number;
  limit: number;
  name?: string;
  categoryId?: string;
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