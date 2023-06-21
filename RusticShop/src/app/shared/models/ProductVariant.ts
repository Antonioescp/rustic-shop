export interface ProductVariant {
  id: number;
  productId: number;
  sku: string;
  unitPrice: number;
  stock: number;
  isPublished: boolean;
}
