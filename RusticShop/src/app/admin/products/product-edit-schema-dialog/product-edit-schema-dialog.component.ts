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
import { lastValueFrom } from 'rxjs';
import { FormControl } from '@angular/forms';

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

  currentAttributes: number[] = [];
  currentCategories: number[] = [];

  @ViewChild('attributesChips') selectedAttributes!: MatChipListbox;
  @ViewChild('categoriesChips') selectedCategories!: MatChipListbox;

  attributeSearchControl!: FormControl<string>;
  categorySearchControl!: FormControl<string>;

  pendingOperations = 0;
  get isBusy(): boolean {
    return this.pendingOperations > 0;
  }

  get filteredCategories() {
    return this.categories.filter((category) => {
      const reduced = (
        category.name +
        category.description +
        category.id
      ).toLowerCase();
      return reduced.includes(this.categorySearchControl.value.toLowerCase());
    });
  }

  get filteredAttributes() {
    return this.attributes.filter((att) => {
      const reduced = (att.name + att.id).toLowerCase();
      return reduced.includes(this.attributeSearchControl.value.toLowerCase());
    });
  }

  constructor(
    @Inject(MAT_DIALOG_DATA) private data: ProductEditSchemaDialogData,
    private dialogRef: MatDialogRef<
      ProductEditDialogComponent,
      ProductEditSchemaDialogResult
    >,
    private productsService: ProductsService,
    private attributesService: AttributesService,
    private categoriesService: CategoriesService
  ) {
    this.categorySearchControl = new FormControl<string>('', {
      nonNullable: true,
    });
    this.attributeSearchControl = new FormControl<string>('', {
      nonNullable: true,
    });
  }

  ngOnInit(): void {
    if (this.data?.id) {
      this.getAttributes();
      this.getCategories();
      this.getProduct();
    } else {
      this.dialogRef.close();
    }
  }

  async getProduct() {
    this.pendingOperations++;
    try {
      const result = await lastValueFrom(
        this.productsService.getById(this.data.id)
      );
      this.product = result;
    } catch (error) {
      console.error(error);
      this.dialogRef.close();
    } finally {
      this.pendingOperations--;
    }
  }

  async getAttributes() {
    this.pendingOperations++;
    try {
      const result = await lastValueFrom(this.attributesService.getAll());
      this.attributes = [...result];

      const attributes = await lastValueFrom(
        this.productsService.getAttributes(this.data.id)
      );
      this.selectedAttributes.value = attributes.map(
        (attribute) => attribute.id
      );
      this.currentAttributes = [...this.selectedAttributes.value];
    } catch (error) {
      console.error(error);
      this.dialogRef.close();
    } finally {
      this.pendingOperations--;
    }
  }

  async getCategories() {
    this.pendingOperations++;

    try {
      this.categories = await lastValueFrom(this.categoriesService.getAll());
      const productCategories = await lastValueFrom(
        this.productsService.getCategories(this.data.id)
      );
      this.selectedCategories.value = productCategories.map((cat) => cat.id);
      this.currentCategories = [...this.selectedCategories.value];
    } catch (error) {
      console.error(error);
      this.dialogRef.close();
    } finally {
      this.pendingOperations--;
    }
  }

  private get categoriesToAdd(): number[] {
    return this.selectedCategories.value.filter(
      (id: number) => !this.currentCategories.includes(id)
    );
  }

  private get categoriesToRemove(): number[] {
    return this.currentCategories.filter(
      (id) => !this.selectedCategories.value.includes(id)
    );
  }

  private get attributesToAdd(): number[] {
    return this.selectedAttributes.value.filter(
      (id: number) => !this.currentAttributes.includes(id)
    );
  }

  private get attributesToRemove(): number[] {
    return this.currentAttributes.filter(
      (id) => !this.selectedAttributes.value.includes(id)
    );
  }

  async onSaveChanges() {
    this.pendingOperations++;
    const promises: Promise<object>[] = [];
    try {
      for (const categoryId of this.categoriesToAdd) {
        promises.push(
          lastValueFrom(
            this.productsService.addCategory(this.data.id, categoryId)
          )
        );
      }

      for (const categoryId of this.categoriesToRemove) {
        promises.push(
          lastValueFrom(
            this.productsService.removeCategory(this.data.id, categoryId)
          )
        );
      }

      for (const attributeId of this.attributesToAdd) {
        promises.push(
          lastValueFrom(
            this.productsService.addAttribute(this.data.id, attributeId)
          )
        );
      }

      for (const attributeId of this.attributesToRemove) {
        promises.push(
          lastValueFrom(
            this.productsService.removeAttribute(this.data.id, attributeId)
          )
        );
      }

      await Promise.allSettled(promises);

      this.dialogRef.close({
        success: true,
      });
    } catch (error) {
      console.error(error);
      this.dialogRef.close({
        success: false,
      });
    } finally {
      this.pendingOperations--;
    }
  }
}
