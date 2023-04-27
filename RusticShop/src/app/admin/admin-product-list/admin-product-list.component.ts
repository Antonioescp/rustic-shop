import { Component, OnInit } from '@angular/core';
import { ProductsService } from 'src/app/products.service';
import VProductList, { VProductListFeature, getFeatures, getVProductListCategories } from 'src/app/shared/models/VProductList';

interface Languages {
  name: string;
  difficulty: 'easy' | 'medium' | 'hard';
}

@Component({
  selector: 'app-admin-product-list',
  templateUrl: './admin-product-list.component.html',
  styleUrls: ['./admin-product-list.component.scss']
})
export class AdminProductListComponent implements OnInit {
  tableData!: VProductList[];
  columnsToDisplay = [
    "id",
    "name",
    "shortDescription",
    "description",
    "unitPrice",
    "categories",
    "features",
    "imagesCount",
    "discountsCount",
    "isPublished",
  ];

  constructor (
    private productsService: ProductsService
  ) {}

  ngOnInit(): void {
    this.productsService.getProductListView().subscribe(
      res => this.tableData = res
    );
  }

  getFeatures(item: VProductList): VProductListFeature[] {
    return getFeatures(item);
  }

  getCategories(item: VProductList): string[] {
    return getVProductListCategories(item);
  }
}
