import { Product } from "./Product";

export default interface Category {
  id: number;
  name: string;
  products: Product[] | null;
}
