import { Component, Inject, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { CrudService } from '../others/CrudService';
import { BaseFormComponent } from './base-form.component';

export interface BaseEditDialogData {
  id?: number;
}

export interface BaseEditDialogResult<Model> {
  success: boolean;
  resource: Model;
}

@Component({ template: '' })
export abstract class BaseEditDialogComponent<Model> extends BaseFormComponent implements OnInit {

  service!: CrudService<Model>;
  title!: string;
  isBusy = false;

  constructor(
    @Inject(MAT_DIALOG_DATA) protected data: BaseEditDialogData,
    protected dialogRef: MatDialogRef<
      BaseEditDialogComponent<Model>,
      BaseEditDialogResult<Model>
      >
  ) {
    super();
  }

  ngOnInit(): void {
    if (this.data?.id) {
      this.getResource(this.data.id);
    }
  }

  getResource(id: number): void {
    this.isBusy = true;
    this.service.getById(id).subscribe({
      next: resource => {
        this.form.patchValue(resource!);
        this.updateTitle(resource);
      },
      error: error => {
        console.error(error);
        this.dialogRef.close();
      },
      complete: () => (this.isBusy = false),
    });
  }

  onSubmit(): void {
    if (this.form.invalid) {
      return;
    }

    const data = this.getFormData();

    if (this.data?.id) {
      this.updateResource(data);
    } else {
      this.createResource(data);
    }
  }

  createResource(data: Model): void {
    this.isBusy = true;
    this.service.create(data).subscribe({
      next: _ => this.dialogRef.close({
        success: true,
        resource: data,
      }),
      error: error => {
        console.error(error);
        this.dialogRef.close({
          success: false,
          resource: data,
        });
      },
      complete: () => this.isBusy = false,
    });
  }

  updateResource(data: Model): void {
    this.isBusy = true;
    this.service.update(data).subscribe({
      next: _ => this.dialogRef.close({
        success: true,
        resource: data,
      }),
      error: error => {
        console.error(error);
        this.dialogRef.close({
          success: false,
          resource: data,
        });
      },
      complete: () => this.isBusy = false,
    });
  }

  abstract getFormData(): Model;
  abstract updateTitle(data: Model): void;
}
