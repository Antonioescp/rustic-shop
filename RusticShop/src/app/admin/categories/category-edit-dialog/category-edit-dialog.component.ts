import { Component, Inject, OnInit } from '@angular/core';
import {
  AbstractControl,
  AsyncValidatorFn,
  FormControl,
  FormGroup,
  ValidationErrors,
  Validators,
} from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { map, Observable } from 'rxjs';
import { CategoriesService } from '../../../services/categories.service';
import { BaseFormComponent } from '../../../shared/components/base-form.component';
import Category from '../../../shared/models/Category';

export interface CategoryEditDialogData {
  id?: number;
}

export interface CategoryEditDialogResult {
  success: boolean;
  category: Category;
}

@Component({
  selector: 'app-category-edit-dialog',
  templateUrl: './category-edit-dialog.component.html',
  styleUrls: ['./category-edit-dialog.component.scss'],
})
export class CategoryEditDialogComponent
  extends BaseFormComponent
  implements OnInit
{
  title = 'Nueva categoría';
  isBusy = false;

  constructor(
    private categoriesService: CategoriesService,
    @Inject(MAT_DIALOG_DATA) private dialogData: CategoryEditDialogData,
    private dialogRef: MatDialogRef<
      CategoryEditDialogComponent,
      CategoryEditDialogResult
    >
  ) {
    super();

    this.form = new FormGroup({
      name: new FormControl('', {
        validators: [Validators.required],
        asyncValidators: [this.checkNameAvailability()],
        nonNullable: true,
      }),
      description: new FormControl('', {
        validators: [Validators.required],
        nonNullable: true,
      }),
    });
  }

  ngOnInit(): void {
    if (this.dialogData?.id) {
      this.getCategory(this.dialogData.id);
    }
  }

  onSubmit(): void {
    if (this.form.invalid) {
      return;
    }

    const data = <Category>{};
    data.name = this.form.controls['name'].value;
    data.description = this.form.controls['description'].value;

    if (this.dialogData?.id) {
      data.id = this.dialogData.id;
      this.updateCategory(data);
    } else {
      this.createCategory(data);
    }
  }

  getCategory(id: number): void {
    this.isBusy = true;
    this.categoriesService.getById(id).subscribe({
      next: category => {
        this.form.patchValue(category);
        this.title = 'Editar - ' + category.name;
      },
      error: error => console.error(error),
      complete: () => (this.isBusy = false),
    });
  }

  createCategory(data: Category): void {
    this.isBusy = true;
    this.categoriesService.create(data).subscribe({
      next: () => this.dialogRef.close({ success: true, category: data }),
      error: error => console.error(error),
      complete: () => (this.isBusy = false),
    });
  }

  updateCategory(data: Category): void {
    this.isBusy = true;
    this.categoriesService.update(data, data.id).subscribe({
      next: () => this.dialogRef.close({ success: true, category: data }),
      error: error => console.error(error),
      complete: () => (this.isBusy = false),
    });
  }

  checkNameAvailability(): AsyncValidatorFn {
    return (control: AbstractControl): Observable<ValidationErrors | null> => {
      return this.categoriesService.checkNameUniqueness(control.value).pipe(
        map(nameTaken => {
          return nameTaken ? null : { nameTaken };
        })
      );
    };
  }
}
