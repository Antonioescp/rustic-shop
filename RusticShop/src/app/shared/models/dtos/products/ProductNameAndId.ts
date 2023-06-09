import { Product } from '../../Product';

export type ProductNameAndId = Pick<Product, 'name' | 'id'>;
