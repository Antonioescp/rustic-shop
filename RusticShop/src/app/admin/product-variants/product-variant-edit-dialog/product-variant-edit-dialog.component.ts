import { Component, Inject, OnInit } from '@angular/core';
import {
  AbstractControl,
  AsyncValidatorFn,
  FormControl,
  FormGroup,
  ValidationErrors,
  Validators,
} from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { Observable, map } from 'rxjs';
import { BrandsService } from 'src/app/services/brands.service';
import { ProductVariantsService } from 'src/app/services/product-variants.service';
import {
  BaseEditDialogComponent,
  BaseEditDialogData,
  BaseEditDialogResult,
} from 'src/app/shared/components/base-edit-dialog.component';
import { ProductVariant } from 'src/app/shared/models/ProductVariant';
import { BrandWithProducts } from 'src/app/shared/models/dtos/brands/BrandWithProducts';

@Component({
  selector: 'app-product-variant-edit-dialog',
  templateUrl: './product-variant-edit-dialog.component.html',
  styleUrls: ['./product-variant-edit-dialog.component.scss'],
})
export class ProductVariantEditDialogComponent
  extends BaseEditDialogComponent<ProductVariant>
  implements OnInit
{
  brands: BrandWithProducts[] = [];

  constructor(
    private productVariantsService: ProductVariantsService,
    private brandsService: BrandsService,
    @Inject(MAT_DIALOG_DATA) data: BaseEditDialogData,
    dialogRef: MatDialogRef<
      ProductVariantEditDialogComponent,
      BaseEditDialogResult<ProductVariant>
    >
  ) {
    super(data, dialogRef);
    this.service = productVariantsService;
    this.title = 'Nueva variante de producto';

    this.form = new FormGroup({
      productId: new FormControl<number | null>(null, {
        nonNullable: false,
        validators: [Validators.required],
      }),
      sku: new FormControl<string>('', {
        nonNullable: false,
        validators: [Validators.required],
        asyncValidators: [this.isSkuAvailable()],
      }),
      unitPrice: new FormControl<number | null>(null, {
        nonNullable: false,
        validators: [Validators.required, Validators.min(0)],
      }),
      isPublished: new FormControl<boolean>(false, {
        nonNullable: true,
      }),
      stock: new FormControl<number | null>(null, {
        nonNullable: false,
        validators: [Validators.required, Validators.min(0)],
      }),
    });
  }

  override ngOnInit(): void {
    super.ngOnInit();
    this.getProducts();
  }

  getProducts() {
    this.isBusy = true;
    this.brandsService.getAllWithProducts().subscribe({
      next: result => {
        this.brands = [...result];
        this.isBusy = false;
      },
      error: error => {
        console.error(error);
        this.isBusy = false;
        this.dialogRef.close();
      },
    });
  }

  getFormData(): ProductVariant {
    const productVariant = <ProductVariant>{};

    productVariant.productId = this.form.controls['productId'].value;
    productVariant.sku = this.form.controls['sku'].value;
    productVariant.isPublished = this.form.controls['isPublished'].value;
    productVariant.unitPrice = this.form.controls['unitPrice'].value;
    productVariant.stock = this.form.controls['stock'].value;

    if (this.data?.id) {
      productVariant.id = this.data.id;
    }

    return productVariant;
  }

  override getId(model: ProductVariant): number {
    return model.id;
  }

  updateTitle(data: ProductVariant): void {
    this.title = 'Editar - ' + data.sku;
  }

  isSkuAvailable(): AsyncValidatorFn {
    return (control: AbstractControl): Observable<ValidationErrors | null> => {
      return this.productVariantsService.isSkuAvailable(control.value).pipe(
        map(isAvailable => {
          if (
            this.resource &&
            this.resource.sku &&
            this.resource.sku === control.value
          ) {
            return null;
          }

          return isAvailable ? null : { nameTaken: true };
        })
      );
    };
  }
}
