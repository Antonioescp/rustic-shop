import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { CategoriesService } from 'src/app/categories.service';
import { FeatureService } from 'src/app/feature.service';
import { ProductsService } from 'src/app/products.service';
import { BaseFormComponent } from 'src/app/shared/components/base-form.component';
import Category from 'src/app/shared/models/Category';
import Feature from 'src/app/shared/models/Feature';
import FeatureProduct from 'src/app/shared/models/FeatureProduct';
import { Product } from 'src/app/shared/models/Product';
import { lastValueFrom } from 'rxjs';
import { Router } from '@angular/router';
import { MatChipSelectionChange } from '@angular/material/chips';

@Component({
  selector: 'app-admin-new-product',
  templateUrl: './admin-new-product.component.html',
  styleUrls: ['./admin-new-product.component.scss']
})
export class AdminNewProductComponent extends BaseFormComponent implements OnInit {
  productForm!: FormGroup;

  featuresForm!: FormGroup;
  availableFeatures!: Feature[];
  addedFeatures: (FeatureProduct & { name: string })[] = [];

  availableCategories!: Category[];
  selectedCategories: number[] = [];

  constructor(
    private productsService: ProductsService,
    private featuresService: FeatureService,
    private categoriesService: CategoriesService,
    private router: Router,
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

    this.featuresForm = new FormGroup({
      feature: new FormControl('', Validators.required),
      content: new FormControl('', Validators.required)
    });
  }

  ngOnInit(): void {
    this.featuresService.getFeatures().subscribe(
      res => this.availableFeatures = res
    );

    this.categoriesService.getCategories().subscribe(
      res => this.availableCategories = res
    );
  }

  addFeature(): void {
    if (this.featuresForm.invalid) {
      return;
    }

    const { id, name } = this.featuresForm.controls['feature'].value;
    const content = this.featuresForm.controls['content'].value;
    this.addedFeatures.push({
      id,
      name,
      content,
    });

    this.availableFeatures = this.availableFeatures.filter(feature => feature.id != id);

    this.featuresForm.reset();
  }

  removeFeature(feature: FeatureProduct & { name: string }) {
    const index = this.addedFeatures.indexOf(feature);
    this.addedFeatures.splice(index, 1);
    this.availableFeatures.push({
      id: feature.id,
      name: feature.name
    });
  }

  categoryChipSelectionChange(event: MatChipSelectionChange) {
    const categoryId: number = event.source.value;
    if (event.selected) {
      this.selectedCategories.push(categoryId);
    } else {
      const index = this.selectedCategories.indexOf(categoryId);
      this.selectedCategories.splice(index, 1);
    }
  }

  async onSubmit(): Promise<void> {
    if (this.productForm.invalid) {
      return;
    }

    const product: Omit<Product, 'id'> = {
      name: this.productForm.controls['name'].value,
      shortDescription: this.productForm.controls['shortDescription'].value,
      description: this.productForm.controls['description'].value,
      unitPrice: this.productForm.controls['unitPrice'].value,
      isPublished: this.productForm.controls['isPublished'].value,
    };

    try {
      const result = await lastValueFrom(this.productsService.addProduct(product));
      const id = result.body.id as number;

      const promises: Promise<any>[] = [];

      this.addedFeatures.forEach(feature => {
        promises.push(lastValueFrom(this.productsService.addFeature({
          content: feature.content,
          productId: id,
          featureId: feature.id
        })));
      });

      this.selectedCategories.forEach(categoryId => {
        promises.push(lastValueFrom(this.productsService.addCategory({
          categoryId: categoryId,
          productId: id
        })));
      });

      const res = await Promise.allSettled(promises);

      if (res.every(p => p.status === 'fulfilled')) {
        console.log('todo good papu');
        this.router.navigate(['/admin/panel/productos'])
      } else {
        console.log('chale');
      }

    } catch (error) {
      console.error(error);
    }
  }
}
