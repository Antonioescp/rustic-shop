import { Component, Inject, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { BrandsService } from '../../../services/brands.service';
import { ProductsService } from '../../../services/products.service';
import {
  BaseEditDialogComponent,
  BaseEditDialogData,
  BaseEditDialogResult,
} from '../../../shared/components/base-edit-dialog.component';
import Brand from '../../../shared/models/Brand';
import { Product } from '../../../shared/models/Product';

@Component({
  selector: 'app-product-edit-dialog',
  templateUrl: './product-edit-dialog.component.html',
  styleUrls: ['./product-edit-dialog.component.scss'],
})
export class ProductEditDialogComponent
  extends BaseEditDialogComponent<Product>
  implements OnInit
{
  brands: Brand[] = [];

  constructor(
    productsService: ProductsService,
    @Inject(MAT_DIALOG_DATA) data: BaseEditDialogData,
    dialogRef: MatDialogRef<
      ProductEditDialogComponent,
      BaseEditDialogResult<Product>
    >,
    private brandsService: BrandsService
  ) {
    super(data, dialogRef);

    this.title = 'Nuevo producto';
    this.service = productsService;

    this.form = new FormGroup({
      name: new FormControl('', {
        validators: [Validators.required],
        nonNullable: true,
      }),
      brandId: new FormControl(-1, {
        validators: [Validators.required, Validators.min(1)],
        nonNullable: true,
      }),
      shortDescription: new FormControl('', {
        validators: [Validators.required],
        nonNullable: true,
      }),
      description: new FormControl('', {
        validators: [Validators.required],
        nonNullable: true,
      }),
      isPublished: new FormControl(false, {
        validators: [Validators.required],
        nonNullable: true,
      }),
    });
  }

  override ngOnInit(): void {
    this.getBrands();
    super.ngOnInit();
  }

  getBrands(): void {
    this.isBusy = true;
    this.brandsService.getAll().subscribe({
      next: (result) => {
        this.brands = [...result];
      },
      error: (error) => {
        console.error(error);
        this.dialogRef.close();
      },
      complete: () => (this.isBusy = false),
    });
  }

  getFormData(): Product {
    const product = <Product>{};

    product.name = this.form.controls['name'].value;
    product.description = this.form.controls['description'].value;
    product.shortDescription = this.form.controls['shortDescription'].value;
    product.brandId = this.form.controls['brandId'].value;
    product.isPublished = this.form.controls['isPublished'].value;

    if (this.data?.id) {
      product.id = this.data.id;
    }

    return product;
  }

  updateTitle(data: Product): void {
    this.title = 'Editar - ' + data.name;
  }
}
