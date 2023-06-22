import {
  Component,
  Inject,
  OnInit,
  AfterViewInit,
  ViewChild,
} from '@angular/core';
import { FormArray, FormControl, FormGroup, Validators } from '@angular/forms';
import { MatChipListbox } from '@angular/material/chips';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { DiscountsService } from 'src/app/services/discounts.service';
import { ProductVariantsService } from 'src/app/services/product-variants.service';
import { BaseFormComponent } from 'src/app/shared/components/base-form.component';
import Discount from 'src/app/shared/models/Discount';
import { ProductVariant } from 'src/app/shared/models/ProductVariant';
import { ProductVariantDiscount } from 'src/app/shared/models/ProductVariantDiscount';
import { lastValueFrom } from 'rxjs';

export interface ProductVariantDiscountManagementDialogData {
  productVariantId: number;
}

export interface ProductVariantDiscountManagementDialogResult {
  productVariant: ProductVariant;
  success: boolean;
  message?: string;
}

@Component({
  selector: 'app-product-variant-discount-management-dialog',
  templateUrl: './product-variant-discount-management-dialog.component.html',
  styleUrls: ['./product-variant-discount-management-dialog.component.scss'],
})
export class ProductVariantDiscountManagementDialogComponent
  extends BaseFormComponent
  implements OnInit, AfterViewInit
{
  @ViewChild(MatChipListbox) discountChips!: MatChipListbox;
  productVariant?: ProductVariant;
  isBusy = false;

  variantDiscounts: ProductVariantDiscount[] = [];
  availableDiscounts: Discount[] = [];

  get discountForms(): FormArray {
    return this.form.get('discounts') as FormArray;
  }

  get discountFormsControls(): FormGroup[] {
    return this.discountForms.controls as FormGroup[];
  }

  constructor(
    @Inject(MAT_DIALOG_DATA)
    private data: ProductVariantDiscountManagementDialogData,
    private dialogRef: MatDialogRef<
      ProductVariantDiscountManagementDialogComponent,
      ProductVariantDiscountManagementDialogResult
    >,
    private variantService: ProductVariantsService,
    private discountService: DiscountsService
  ) {
    super();
    this.form = new FormGroup({
      discounts: new FormArray([]),
    });
  }

  ngOnInit(): void {
    this.getVariant();
    this.getAvailableDiscounts();
  }

  ngAfterViewInit(): void {
    this.discountChips.chipSelectionChanges.subscribe(event => {
      const { selected, source } = event;
      const { value } = source;

      if (selected) {
        const discount = this.availableDiscounts.find(d => d.id === value);
        const variantDiscount = this.variantDiscounts.find(
          pvd => pvd.discountId === value
        );
        if (discount) {
          this.addDiscountForm({
            discountId: discount.id,
            startDate:
              variantDiscount?.startDate ?? new Date().toLocaleDateString(),
            endDate:
              variantDiscount?.endDate ?? new Date().toLocaleDateString(),
            percentage: variantDiscount?.percentage ?? 0,
          });
        }
      } else {
        const index = this.discountForms.controls.findIndex(
          c => c.value.discountId === value
        );
        if (index >= 0) {
          this.discountForms.removeAt(index);
        }
      }
    });
    this.getVariantDiscounts();
  }

  getVariant() {
    this.variantService.getById(this.data.productVariantId).subscribe({
      next: variant => {
        this.productVariant = variant;
      },
      error: error => {
        console.error(error);
      },
    });
  }

  getVariantDiscounts() {
    this.variantService.getDiscounts(this.data.productVariantId).subscribe({
      next: discounts => {
        this.variantDiscounts = discounts;
        this.discountChips.value = discounts.map(d => d.discountId);
      },
      error: error => {
        console.error(error);
      },
    });
  }

  getAvailableDiscounts() {
    this.discountService.getAll().subscribe({
      next: discounts => {
        this.availableDiscounts = discounts;
      },
      error: error => {
        console.error(error);
      },
    });
  }

  addDiscountForm(
    discount: Omit<ProductVariantDiscount, 'productVariantId' | 'id'>
  ) {
    this.discountForms.push(
      new FormGroup({
        discountId: new FormControl<number | null>(discount.discountId, {
          nonNullable: false,
          validators: [Validators.required],
        }),
        startDate: new FormControl(discount.startDate, {
          validators: [Validators.required],
        }),
        endDate: new FormControl(discount.endDate, {
          validators: [Validators.required],
        }),
        percentage: new FormControl<number | null>(discount.percentage * 100, {
          nonNullable: false,
          validators: [
            Validators.required,
            Validators.pattern(/^[0-9]+$/),
            Validators.min(1),
            Validators.max(100),
          ],
        }),
      })
    );
  }

  getDiscountName(discountId: number): string {
    return this.availableDiscounts.find(d => d.id === discountId)?.name ?? '';
  }

  async onSave() {
    const promises: Promise<any>[] = [];

    this.isBusy = true;

    this.variantDiscounts.forEach(variantDiscount => {
      promises.push(
        lastValueFrom(
          this.variantService.removeDiscount(
            this.data.productVariantId,
            variantDiscount.discountId
          )
        )
      );
    });

    this.discountFormsControls.forEach(form => {
      const discountId = form.value.discountId;
      const startDate = form.value.startDate;
      const endDate = form.value.endDate;
      const percentage = form.value.percentage / 100;

      if (discountId && startDate && endDate && percentage) {
        promises.push(
          lastValueFrom(
            this.variantService.addDiscount(this.data.productVariantId, {
              discountId,
              startDate,
              endDate,
              percentage,
            })
          )
        );
      }
    });

    try {
      await Promise.allSettled(promises);
    } catch (error) {
      console.error(error);
    } finally {
      this.isBusy = false;
    }

    this.dialogRef.close({
      productVariant: this.productVariant!,
      success: true,
    });
  }
}
