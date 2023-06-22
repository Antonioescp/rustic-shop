import {
  AfterViewInit,
  Component,
  Inject,
  ViewChild,
  ChangeDetectorRef,
} from '@angular/core';
import { FormArray, FormControl, FormGroup, Validators } from '@angular/forms';
import { MatChipListbox } from '@angular/material/chips';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { ProductVariantsService } from 'src/app/services/product-variants.service';
import { ProductsService } from 'src/app/services/products.service';
import { BaseFormComponent } from 'src/app/shared/components/base-form.component';
import Attribute from 'src/app/shared/models/Attribute';
import { ProductVariant } from 'src/app/shared/models/ProductVariant';
import { ProductVariantAttributeDto } from 'src/app/shared/models/dtos/product-variants/ProductVariantAttributeDto';
import { lastValueFrom } from 'rxjs';

export interface ProductVariantEditSchemaDialogData {
  productVariantId: number;
}

export interface ProductVariantEditSchemaDialogResult {
  success: boolean;
  resource: ProductVariant;
  message?: string;
}

@Component({
  selector: 'app-product-variant-edit-schema-dialog',
  templateUrl: './product-variant-edit-schema-dialog.component.html',
  styleUrls: ['./product-variant-edit-schema-dialog.component.scss'],
})
export class ProductVariantEditSchemaDialogComponent
  extends BaseFormComponent
  implements AfterViewInit
{
  productVariant?: ProductVariant;

  pendingOperations = 0;
  get isBusy(): boolean {
    return this.pendingOperations > 0;
  }

  @ViewChild(MatChipListbox) selectedAttributes!: MatChipListbox;

  get attributesForm(): FormArray {
    return this.form.get('attributes') as FormArray;
  }
  get attributesFormControls(): FormGroup[] {
    return this.attributesForm.controls as FormGroup[];
  }

  availableAttributes: Attribute[] = [];
  variantAttributes: ProductVariantAttributeDto[] = [];

  constructor(
    private variantService: ProductVariantsService,
    private productService: ProductsService,
    @Inject(MAT_DIALOG_DATA) public data: ProductVariantEditSchemaDialogData,
    private dialogRef: MatDialogRef<
      ProductVariantEditSchemaDialogComponent,
      ProductVariantEditSchemaDialogResult
    >,
    private cd: ChangeDetectorRef
  ) {
    super();
    this.form = new FormGroup({
      attributes: new FormArray([]),
    });
  }

  ngAfterViewInit(): void {
    this.getProductVariant();
    this.cd.detectChanges();

    this.selectedAttributes.chipSelectionChanges.subscribe(selection => {
      const { selected } = selection;
      const { value: attributeId } = selection.source;

      if (selected) {
        const att = this.variantAttributes.find(
          a => a.attributeId === attributeId
        );
        this.addFormAttribute(attributeId, att?.value ?? '');
      } else {
        this.removeFormAttributeById(attributeId);
      }
    });
  }

  getProductVariant(): void {
    this.pendingOperations++;
    this.variantService.getById(this.data.productVariantId).subscribe({
      next: variant => {
        this.productVariant = variant;
        this.getProductAttributes();
        this.getProductVariantAttributes();
        this.pendingOperations--;
      },
      error: err => {
        console.error(err);
        this.pendingOperations--;
      },
    });
  }

  getProductAttributes(): void {
    this.pendingOperations++;
    this.productService
      .getAttributes(this.productVariant!.productId)
      .subscribe({
        next: attributes => {
          this.pendingOperations--;
          this.availableAttributes = attributes;
        },
        error: err => {
          console.error(err);
          this.pendingOperations--;
        },
      });
  }

  getProductVariantAttributes(): void {
    this.pendingOperations++;
    this.variantService.getAttributes(this.productVariant!.id).subscribe({
      next: attributes => {
        this.variantAttributes = attributes;
        this.selectedAttributes.value = attributes.map(a => a.attributeId);
        this.pendingOperations--;
      },
      error: err => {
        console.error(err);
        this.pendingOperations--;
      },
    });
  }

  getAttributeName(attributeId: number): string {
    return this.availableAttributes.find(a => a.id === attributeId)?.name ?? '';
  }

  addFormAttribute(attributeId: number, value: string): void {
    this.attributesForm.push(
      new FormGroup({
        attributeId: new FormControl<number | null>(
          attributeId,
          Validators.required
        ),
        value: new FormControl<string | null>(value, Validators.required),
      })
    );
  }

  removeFormAttributeById(attributeId: number): void {
    const index = this.attributesForm.controls.findIndex(
      a => a.value.attributeId === attributeId
    );
    this.attributesForm.removeAt(index);
  }

  async onSave() {
    this.pendingOperations++;
    const promises: Promise<any>[] = [];

    // delete all attributes
    this.variantAttributes.forEach(a => {
      promises.push(
        lastValueFrom(
          this.variantService.deleteAttribute(
            this.productVariant!.id,
            a.attributeId
          )
        )
      );
    });

    this.attributesFormControls.forEach(a => {
      const attributeId = a.get('attributeId')?.value;
      const value = a.get('value')?.value;

      promises.push(
        lastValueFrom(
          this.variantService.addAttribute(this.productVariant!.id, {
            attributeId,
            value,
          })
        )
      );
    });

    try {
      await Promise.allSettled(promises);
    } catch (err) {
      console.error(err);
    } finally {
      this.dialogRef.close({
        success: true,
        resource: this.productVariant!,
        message: 'Product variant schema updated successfully.',
      });
    }
  }
}
