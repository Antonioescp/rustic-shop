export interface ProductVariantDiscount {
  id: number;
  productVariantId: number;
  discountId: number;
  startDate: string;
  endDate: string;
  percentage: number;
}
