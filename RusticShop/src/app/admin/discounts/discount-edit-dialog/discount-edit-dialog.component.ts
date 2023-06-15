import { Component, Inject } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { DiscountsService } from '../../../services/discounts.service';
import {
  BaseEditDialogComponent,
  BaseEditDialogData,
  BaseEditDialogResult,
} from '../../../shared/components/base-edit-dialog.component';
import Discount from '../../../shared/models/Discount';

@Component({
  selector: 'app-discount-edit-dialog',
  templateUrl: './discount-edit-dialog.component.html',
  styleUrls: ['./discount-edit-dialog.component.scss'],
})
export class DiscountEditDialogComponent extends BaseEditDialogComponent<Discount> {
  constructor(
    discountsService: DiscountsService,
    @Inject(MAT_DIALOG_DATA) data: BaseEditDialogData,
    dialogRef: MatDialogRef<
      DiscountEditDialogComponent,
      BaseEditDialogResult<Discount>
    >
  ) {
    super(data, dialogRef);

    this.service = discountsService;
    this.title = 'Nuevo descuento';

    this.form = new FormGroup({
      name: new FormControl('', {
        validators: [Validators.required],
        nonNullable: true,
      }),
      description: new FormControl('', {
        validators: [Validators.required],
        nonNullable: true,
      }),
    });
  }

  getFormData(): Discount {
    const data = <Discount>{};

    data.name = this.form.controls['name'].value;
    data.description = this.form.controls['description'].value;

    if (this.data?.id) {
      data.id = this.data.id;
    }

    return data;
  }

  override getId(model: Discount): number {
    return model.id;
  }

  updateTitle(data: Discount): void {
    this.title = 'Editar - ' + data.name;
  }
}
