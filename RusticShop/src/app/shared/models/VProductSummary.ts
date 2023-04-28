import { CollectionViewer, DataSource } from "@angular/cdk/collections";
import { Observable } from 'rxjs';
import { ProductsService } from "src/app/products.service";

export default interface VProductSummary {
  id: number;
  name: string;
  shortDescription: string;
  unitPrice: number;
  categories?: string;
  imagesCount: string;
  isPublished: boolean;
}

export function getVProductSummaryCategories(item: VProductSummary): string[] {
  return item.categories?.split(',') ?? [];
}

export class VProductSummaryDataSource extends DataSource<VProductSummary> {
  constructor(private productsService: ProductsService) {
    super();
  }

  connect(): Observable<VProductSummary[]> {
    return this.productsService.getProductListView();
  }

  disconnect(collectionViewer: CollectionViewer): void { }
}
