import { Component, Inject, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { ProviderService } from 'src/app/services/provider.service';
import { PurchaseService } from 'src/app/services/purchase.service';
import {
  BaseEditDialogComponent,
  BaseEditDialogData,
  BaseEditDialogResult,
} from 'src/app/shared/components/base-edit-dialog.component';
import { Provider } from 'src/app/shared/models/Provider';
import { Purchase } from 'src/app/shared/models/Purchase';

@Component({
  selector: 'app-purchase-edit-dialog',
  templateUrl: './purchase-edit-dialog.component.html',
  styleUrls: ['./purchase-edit-dialog.component.scss'],
})
export class PurchaseEditDialogComponent
  extends BaseEditDialogComponent<Purchase>
  implements OnInit
{
  availableProviders: Provider[] = [];

  constructor(
    @Inject(MAT_DIALOG_DATA) data: BaseEditDialogData<number>,
    dialogRef: MatDialogRef<
      PurchaseEditDialogComponent,
      BaseEditDialogResult<Purchase>
    >,
    purchaseService: PurchaseService,
    private providerService: ProviderService
  ) {
    super(data, dialogRef);

    this.service = purchaseService;
    this.title = 'Crear compra';

    this.form = new FormGroup({
      date: new FormControl('', {
        validators: [Validators.required],
      }),
      providerId: new FormControl('', {
        validators: [Validators.required],
      }),
    });
  }

  override ngOnInit(): void {
    super.ngOnInit();

    this.providerService.getAll().subscribe(providers => {
      this.availableProviders = [...providers];
    });
  }

  override getFormData(): Purchase {
    const data = <Purchase>{};

    data.date = this.form.get('date')?.value;
    data.providerId = this.form.get('providerId')?.value;

    if (this.data?.id) {
      data.id = this.data.id;
    }

    return data;
  }

  override getId(model: Purchase): number {
    return model.id;
  }

  override updateTitle(data: Purchase): void {
    this.title = `Editar compra - #${data.id}`;
  }
}
