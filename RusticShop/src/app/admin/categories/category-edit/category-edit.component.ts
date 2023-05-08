import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import {
  AbstractControl,
  AsyncValidatorFn,
  FormControl,
  FormGroup,
  ValidationErrors,
  Validators,
} from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { Observable, map, subscribeOn } from 'rxjs';
import { CategoriesService } from 'src/app/categories.service';
import { BaseFormComponent } from 'src/app/shared/components/base-form.component';
import Category from 'src/app/shared/models/Category';

@Component({
  selector: 'app-category-edit',
  templateUrl: './category-edit.component.html',
  styleUrls: ['./category-edit.component.scss'],
})
export class CategoryEditComponent extends BaseFormComponent implements OnInit {
  title?: string;
  category?: Category;
  id?: number;

  constructor(
    private activatedRoute: ActivatedRoute,
    private router: Router,
    private categoriesService: CategoriesService
  ) {
    super();
  }

  ngOnInit(): void {
    this.form = new FormGroup({
      name: new FormControl('', [Validators.required], this.isNameTaken()),
      description: new FormControl('', [Validators.required]),
    });

    this.loadData();
  }

  loadData() {
    const idParam = this.activatedRoute.snapshot.paramMap.get('id');
    this.id = idParam ? +idParam : 0;

    if (this.id) {
      this.categoriesService.getCategory(this.id).subscribe({
        next: (result) => {
          this.category = result;
          this.title = `Editar - ${this.category.name}`;
          this.form.patchValue(this.category);
        },
        error: (error) => console.error(error),
      });
    } else {
      this.title = 'Nueva Categoría';
    }
  }

  onSubmit() {
    const category = this.category ? this.category : <Category>{};
    category.name = this.form.controls['name'].value;
    category.description = this.form.controls['description'].value;

    if (this.id) {
      // Modo de edicion
      category.id = this.id;
      this.categoriesService.updateCategory(category).subscribe({
        next: (result) => {
          this.router.navigate(['/admin/panel/categorias']);
        },
        error: (error) => console.error(error),
      });
    } else {
      // Modo de creacion
      this.categoriesService.addCategory(category).subscribe({
        next: (result) => {
          this.router.navigate(['/admin/panel/categorias']);
        },
        error: (error) => console.error(error),
      });
    }
  }

  isNameTaken(): AsyncValidatorFn {
    return (control: AbstractControl): Observable<ValidationErrors | null> => {
      if (this.id && this.category && this.category.name == control.value) {
        return new Observable((sub) => sub.next(null));
      }

      return this.categoriesService.checkNameUniqueness(control.value).pipe(
        map((isAvailable) => {
          return isAvailable ? null : { nameTaken: true };
        })
      );
    };
  }
}
