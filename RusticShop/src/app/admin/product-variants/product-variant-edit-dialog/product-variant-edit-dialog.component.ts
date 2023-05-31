import { Component, Inject } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { ProductVariantsService } from 'src/app/services/product-variants.service';
import {
  BaseEditDialogComponent,
  BaseEditDialogData,
  BaseEditDialogResult,
} from 'src/app/shared/components/base-edit-dialog.component';
import { ProductVariant } from 'src/app/shared/models/ProductVariant';

@Component({
  selector: 'app-product-variant-edit-dialog',
  templateUrl: './product-variant-edit-dialog.component.html',
  styleUrls: ['./product-variant-edit-dialog.component.scss'],
})
export class ProductVariantEditDialogComponent extends BaseEditDialogComponent<ProductVariant> {
  constructor(
    private productVariantsService: ProductVariantsService,
    @Inject(MAT_DIALOG_DATA) data: BaseEditDialogData,
    dialogRef: MatDialogRef<
      ProductVariantEditDialogComponent,
      BaseEditDialogResult<ProductVariant>
    >
  ) {
    super(data, dialogRef);
    this.service = productVariantsService;
    this.title = 'Nueva característica';

    this.form = new FormGroup({
      productId: new FormControl<number | null>(null, {
        nonNullable: true,
        validators: [Validators.required],
      }),
      sku: new FormControl<string>('', {
        nonNullable: false,
        validators: [Validators.required],
      }),
      unitPrice: new FormControl<number>(0, {
        nonNullable: true,
        validators: [Validators.required],
      }),
      isPublished: new FormControl<boolean>(false, {
        nonNullable: true,
      }),
    });
  }

  getFormData(): ProductVariant {
    const productVariant = <ProductVariant>{};

    productVariant.productId = this.form.controls['productId'].value;
    productVariant.sku = this.form.controls['sku'].value;
    productVariant.isPublished = this.form.controls['isPublished'].value;
    productVariant.unitPrice = this.form.controls['unitPrice'].value;

    if (this.data?.id) {
      productVariant.id = this.data.id;
    }

    return productVariant;
  }

  updateTitle(data: ProductVariant): void {
    this.title = 'Editar - ' + data.sku;
  }
}
