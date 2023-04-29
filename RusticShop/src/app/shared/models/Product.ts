export interface Product {
  id: number;
  name: string;
  shortDescription: string;
  description: string | null;
  unitPrice: number;
  isPublished: boolean;
}
