export interface Product {
  id: number;
  brandId: number;
  name: string;
  shortDescription: string;
  description: string | null;
  isPublished: boolean;
}
