import { Component, OnInit } from '@angular/core';
import { FormArray, FormControl, FormGroup, Validators } from '@angular/forms';
import { CategoriesService } from 'src/app/categories.service';
import { ProductsService } from 'src/app/products.service';
import { BaseFormComponent } from 'src/app/shared/components/base-form.component';
import Category from 'src/app/shared/models/Category';

@Component({
  selector: 'app-admin-new-product',
  templateUrl: './admin-new-product.component.html',
  styleUrls: ['./admin-new-product.component.scss']
})
export class AdminNewProductComponent extends BaseFormComponent implements OnInit {
  productForm!: FormGroup;
  categoriesForm!: FormGroup;
  featuresForm!: FormGroup;

  availableCategories!: Category[];

  constructor(
    private productsService: ProductsService,
    private categoriesService: CategoriesService
  ) {
    super();
    this.productForm = new FormGroup({
      name: new FormControl('',[
        Validators.required
      ]),
      shortDescription: new FormControl('', [
        Validators.required,
        Validators.minLength(10),
        Validators.maxLength(100)
      ]),
      description: new FormControl('', [
        Validators.required,
        Validators.minLength(20),
        Validators.maxLength(300)
      ]),
      unitPrice: new FormControl(0, [
        Validators.required,
        Validators.min(0)
      ]),
      isPublished: new FormControl<boolean>(false),
    });

    this.featuresForm = new FormGroup({});
  }

  ngOnInit(): void {
    this.categoriesService.getCategories().subscribe(
      res => this.availableCategories = res
    );
  }

  onSubmit(): void {
    console.log('Terminado');
  }
}
