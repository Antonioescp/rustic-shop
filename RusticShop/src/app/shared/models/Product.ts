import Category from "./Category";

export interface Product {
  id: number;
  name: string;
  shortDescription: string;
  description: string | null;
  unitPrice: number;
  isPublished: boolean;

  categoriesId: Category[] | null;
}
