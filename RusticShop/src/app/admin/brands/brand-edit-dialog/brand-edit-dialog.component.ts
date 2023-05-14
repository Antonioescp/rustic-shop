import { Component, OnInit, Inject } from '@angular/core';
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
import { BrandsService } from 'src/app/brands.service';
import { BaseFormComponent } from 'src/app/shared/components/base-form.component';
import Brand from 'src/app/shared/models/Brand';
import { BrandDto } from 'src/app/shared/models/dtos/brands/CreateBrandDto';

export interface BrandEditDialogData {
  id?: number;
}

export interface BrandEditDialogResult {
  success: boolean;
  brand: BrandDto;
}

@Component({
  selector: 'app-brand-edit-dialog',
  templateUrl: './brand-edit-dialog.component.html',
  styleUrls: ['./brand-edit-dialog.component.scss'],
})
export class BrandEditDialogComponent
  extends BaseFormComponent
  implements OnInit
{
  id?: number;
  brand?: Brand;
  title = '';
  isBusy = false;

  constructor(
    public dialogRef: MatDialogRef<
      BrandEditDialogComponent,
      BrandEditDialogResult
    >,
    @Inject(MAT_DIALOG_DATA) private data: BrandEditDialogData | null,
    private brandsService: BrandsService
  ) {
    super();

    this.form = new FormGroup({
      name: new FormControl('', {
        validators: [Validators.required],
        asyncValidators: [this.checkNameAvailability()],
        nonNullable: true,
      }),
    });
  }

  ngOnInit(): void {
    this.id = this.data?.id;

    if (this.id) {
      this.getBrand(this.id);
    } else {
      this.title = 'Nueva marca';
    }
  }

  getBrand(id: number): void {
    this.isBusy = true;
    this.brandsService.getById(id).subscribe({
      next: (result) => {
        this.brand = result;
        this.title = `Editar - ${this.brand.name}`;
        this.form.patchValue(this.brand);
      },
      error: (error) => console.error(error),
      complete: () => (this.isBusy = false),
    });
  }

  onSubmit(): void {
    if (this.form.invalid) {
      return;
    }
    const name = this.form.controls['name'].value;

    if (this.brand) {
      this.brand.name = name;
      this.updateBrand(this.brand);
    } else {
      this.createBrand({ name });
    }
  }

  createBrand(brandDto: BrandDto): void {
    this.isBusy = true;
    this.brandsService.create(brandDto).subscribe({
      next: (_) => {
        this.dialogRef.close({ success: true, brand: brandDto });
      },
      error: (error) => console.error(error),
      complete: () => (this.isBusy = false),
    });
  }

  updateBrand(brand: Brand): void {
    this.isBusy = true;
    this.brandsService.update(brand).subscribe({
      next: (_) => {
        this.dialogRef.close({ success: true, brand: { name: brand.name } });
      },
      error: (error) => console.error(error),
      complete: () => (this.isBusy = false),
    });
  }

  checkNameAvailability(): AsyncValidatorFn {
    return (control: AbstractControl): Observable<ValidationErrors | null> => {
      return this.brandsService.isNameAvailable(control.value).pipe(
        map((isAvailable) => {
          return isAvailable ? null : { nameTaken: true };
        })
      );
    };
  }
}
