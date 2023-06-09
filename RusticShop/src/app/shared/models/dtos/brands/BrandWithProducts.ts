import { ProductNameAndId } from '../products/ProductNameAndId';

export interface BrandWithProducts {
  name: string;
  products: ProductNameAndId[];
}
