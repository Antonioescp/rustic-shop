import { Component, Inject } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { ProviderService } from 'src/app/services/provider.service';
import {
  BaseEditDialogComponent,
  BaseEditDialogData,
  BaseEditDialogResult,
} from 'src/app/shared/components/base-edit-dialog.component';
import { Provider } from 'src/app/shared/models/Provider';

@Component({
  selector: 'app-provider-edit-dialog',
  templateUrl: './provider-edit-dialog.component.html',
  styleUrls: ['./provider-edit-dialog.component.scss'],
})
export class ProviderEditDialogComponent extends BaseEditDialogComponent<Provider> {
  constructor(
    providerService: ProviderService,
    @Inject(MAT_DIALOG_DATA) data: BaseEditDialogData,
    dialogRef: MatDialogRef<
      ProviderEditDialogComponent,
      BaseEditDialogResult<Provider>
    >
  ) {
    super(data, dialogRef);
    this.title = 'Crear proveedor';
    this.service = providerService;

    this.form = new FormGroup({
      name: new FormControl<string>('', {
        validators: [Validators.required],
      }),
      phoneNumber: new FormControl<string | null>(null, {
        nonNullable: false,
      }),
      email: new FormControl<string | null>(null, {
        nonNullable: false,
      }),
    });
  }

  override getFormData(): Provider {
    const data = <Provider>{};

    data.email = this.form.get('email')?.value;
    data.name = this.form.get('name')?.value;
    data.phoneNumber = this.form.get('phoneNumber')?.value;

    if (this.data?.id) {
      data.id = this.data.id;
    }

    return data;
  }

  override getId(model: Provider): number {
    return model.id;
  }

  override updateTitle(data: Provider): void {
    this.title = `Editar - ${data.name}`;
  }
}
