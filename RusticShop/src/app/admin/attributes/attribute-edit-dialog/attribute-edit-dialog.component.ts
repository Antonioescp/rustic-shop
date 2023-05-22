import { Component, Inject } from '@angular/core';
import { AbstractControl, AsyncValidatorFn, FormControl, FormGroup, ValidationErrors, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { map, Observable } from 'rxjs';
import { AttributesService } from '../../../services/attributes.service';
import { BaseEditDialogComponent, BaseEditDialogData, BaseEditDialogResult } from '../../../shared/components/base-edit-dialog.component';
import Attribute from '../../../shared/models/Attribute';

@Component({
  selector: 'app-attribute-edit-dialog',
  templateUrl: './attribute-edit-dialog.component.html',
  styleUrls: ['./attribute-edit-dialog.component.scss']
})
export class AttributeEditDialogComponent extends BaseEditDialogComponent<Attribute> {

  constructor(
    private attributesService: AttributesService,
    @Inject(MAT_DIALOG_DATA) data: BaseEditDialogData,
    dialogRef: MatDialogRef<AttributeEditDialogComponent, BaseEditDialogResult<Attribute>>
  ) {
    super(data, dialogRef);
    this.service = attributesService;
    this.title = 'Nueva característica';

    this.form = new FormGroup({
      name: new FormControl('', {
        validators: [
          Validators.required,
        ],
        asyncValidators: [
          this.checkNameAvailability()
        ],
        nonNullable: true,
      })
    });
  }

  getFormData(): Attribute {
    const attribute = <Attribute>{};

    attribute.name = this.form.controls['name'].value;

    if (this.data?.id) {
      attribute.id = this.data.id;
    }

    return attribute;
  }

  updateTitle(data: Attribute): void {
    this.title = 'Editar - ' + data.name;
  }

  checkNameAvailability(): AsyncValidatorFn {
    return (control: AbstractControl): Observable<ValidationErrors | null> => {
      return this.attributesService.isNameUnique(control.value).pipe(map(notTaken => {
        return notTaken ? null : { nameTaken: true };
      }));
    }
  }

}
