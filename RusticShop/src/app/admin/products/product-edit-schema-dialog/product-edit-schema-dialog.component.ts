import { Component, Inject, OnInit, ViewChild } from '@angular/core';
import { MatChipListbox } from '@angular/material/chips';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { AttributesService } from '../../../services/attributes.service';
import { CategoriesService } from '../../../services/categories.service';
import { ProductsService } from '../../../services/products.service';
import { ProductEditDialogComponent } from '../product-edit-dialog/product-edit-dialog.component';

export interface ProductEditSchemaDialogData {
  id: number;
}

export interface ProductEditSchemaDialogResult {
  success: boolean;
}

@Component({
  selector: 'app-product-edit-schema-dialog',
  templateUrl: './product-edit-schema-dialog.component.html',
  styleUrls: ['./product-edit-schema-dialog.component.scss']
})
export class ProductEditSchemaDialogComponent implements OnInit {

  @ViewChild('categories') categories!: MatChipListbox;
  @ViewChild('attributes') attributes!: MatChipListbox;

  pendingOperations = 0;
  get isBusy(): boolean {
    return this.pendingOperations > 0;
  }

  constructor(
    @Inject(MAT_DIALOG_DATA) private data: ProductEditSchemaDialogData,
    private dialogRef: MatDialogRef<ProductEditDialogComponent, ProductEditSchemaDialogData>,
    private productsService: ProductsService,
    private attributesService: AttributesService,
    private categoriesService: CategoriesService,
  ) {
    
  }

  ngOnInit(): void {
    if (this.data?.id) {
      this.getAttributes();
      this.getCategories();
    } else {
      this.dialogRef.close();
    }
  }

  getAttributes(): void {
    this.pendingOperations++;
    this.attributesService.getAll().subscribe({
      next: attributes => {
        this.attributes.value = attributes.map(attribute => attribute.id);
      },
      error: error => {
        console.error(error);
        this.dialogRef.close();
      },
      complete: () => this.pendingOperations--,
    });
  }

  getCategories(): void {
    this.pendingOperations++;
    this.categoriesService.getAll().subscribe({
      next: categories => {
        this.categories.value = categories.map(category => category.id);
      },
      error: error => {
        console.error(error);
        this.dialogRef.close();
      },
      complete: () => this.pendingOperations--,
    });
  }

}
