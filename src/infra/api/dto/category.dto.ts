export interface CategoryDto {
  id: string;
  name: string;
}

export interface ListCategoriesOutputDto {
  data: CategoryDto[];
  total: number;
}