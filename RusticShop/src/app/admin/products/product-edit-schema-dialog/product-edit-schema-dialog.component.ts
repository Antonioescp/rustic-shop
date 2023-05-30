import { Component, Inject, OnInit, ViewChild } from '@angular/core';
import { MatChipListbox } from '@angular/material/chips';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { AttributesService } from '../../../services/attributes.service';
import { CategoriesService } from '../../../services/categories.service';
import { ProductsService } from '../../../services/products.service';
import { ProductEditDialogComponent } from '../product-edit-dialog/product-edit-dialog.component';
import { Product } from 'src/app/shared/models/Product';
import Category from 'src/app/shared/models/Category';
import Attribute from 'src/app/shared/models/Attribute';

export interface ProductEditSchemaDialogData {
  id: number;
}

export interface ProductEditSchemaDialogResult {
  success: boolean;
}

@Component({
  selector: 'app-product-edit-schema-dialog',
  templateUrl: './product-edit-schema-dialog.component.html',
  styleUrls: ['./product-edit-schema-dialog.component.scss'],
})
export class ProductEditSchemaDialogComponent implements OnInit {
  product?: Product;
  attributes: Attribute[] = [];
  categories: Category[] = [];

  @ViewChild('categoriesListBox') categoriesListBox!: MatChipListbox;
  @ViewChild('attributesListBox') attributesListBox!: MatChipListbox;

  pendingOperations = 0;
  get isBusy(): boolean {
    return this.pendingOperations > 0;
  }

  constructor(
    @Inject(MAT_DIALOG_DATA) private data: ProductEditSchemaDialogData,
    private dialogRef: MatDialogRef<
      ProductEditDialogComponent,
      ProductEditSchemaDialogData
    >,
    private productsService: ProductsService,
    private attributesService: AttributesService,
    private categoriesService: CategoriesService
  ) {}

  ngOnInit(): void {
    if (this.data?.id) {
      this.getAttributes();
      this.getCategories();
      this.getProduct();
    } else {
      this.dialogRef.close();
    }
  }

  getProduct() {
    this.pendingOperations++;
    this.productsService.getById(this.data.id).subscribe({
      next: (result) => (this.product = result),
      error: (error) => console.error(error),
      complete: () => this.pendingOperations--,
    });
  }

  getAttributes(): void {
    this.pendingOperations++;
    this.attributesService.getAll().subscribe({
      next: (attributes) => {
        this.attributes = [...attributes];
        this.attributesListBox.value = attributes.map(
          (attribute) => attribute.id
        );
      },
      error: (error) => {
        console.error(error);
        this.dialogRef.close();
      },
      complete: () => this.pendingOperations--,
    });
  }

  getCategories(): void {
    this.pendingOperations++;
    this.categoriesService.getAll().subscribe({
      next: (categories) => {
        this.categories = [...categories];
        this.categoriesListBox.value = categories.map(
          (category) => category.id
        );
      },
      error: (error) => {
        console.error(error);
        this.dialogRef.close();
      },
      complete: () => this.pendingOperations--,
    });
  }
}
