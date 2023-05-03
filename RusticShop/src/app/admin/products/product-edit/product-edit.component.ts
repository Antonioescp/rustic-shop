import { Component, OnInit, ViewChild } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import {
  MatChipListbox,
  MatChipListboxChange,
  MatChipOption,
  MatChipSelectionChange,
} from '@angular/material/chips';
import { ActivatedRoute, Router } from '@angular/router';
import { CategoriesService } from 'src/app/categories.service';
import { FeatureService } from 'src/app/feature.service';
import { ProductsService } from 'src/app/products.service';
import { BaseFormComponent } from 'src/app/shared/components/base-form.component';
import ProductFeature from 'src/app/shared/dtos/Product/product-feature';
import Category from 'src/app/shared/models/Category';
import Feature from 'src/app/shared/models/Feature';
import { Product } from 'src/app/shared/models/Product';
import { lastValueFrom } from 'rxjs';

@Component({
  selector: 'app-product-edit',
  templateUrl: './product-edit.component.html',
  styleUrls: ['./product-edit.component.scss'],
})
export class ProductEditComponent extends BaseFormComponent implements OnInit {
  title?: string;
  product?: Product;
  id?: number;

  featuresForm!: FormGroup;
  availableFeatures!: Feature[];
  selectedFeatures: ProductFeature[] = [];
  alreadySelectedFeatures: ProductFeature[] = [];

  availableCategories!: Category[];
  alreadySelectedCategories: number[] = [];

  @ViewChild(MatChipListbox) chipList!: MatChipListbox;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private productsService: ProductsService,
    private featuresService: FeatureService,
    private categoriesService: CategoriesService
  ) {
    super();
  }

  ngOnInit(): void {
    this.form = new FormGroup({
      name: new FormControl('', [Validators.required]),
      shortDescription: new FormControl('', [
        Validators.required,
        Validators.minLength(10),
        Validators.maxLength(100),
      ]),
      description: new FormControl('', [
        Validators.required,
        Validators.minLength(20),
        Validators.maxLength(300),
      ]),
      unitPrice: new FormControl(0, [Validators.required, Validators.min(0)]),
      isPublished: new FormControl<boolean>(false),
    });

    this.featuresForm = new FormGroup({
      feature: new FormControl('', Validators.required),
      content: new FormControl('', Validators.required),
    });

    this.loadData();
  }

  loadData(): void {
    const idParam = this.route.snapshot.paramMap.get('id');
    this.id = idParam ? +idParam : 0;

    this.featuresService
      .getFeatures()
      .subscribe((res) => (this.availableFeatures = [...res]));

    this.categoriesService
      .getCategories()
      .subscribe((res) => (this.availableCategories = [...res]));

    if (this.id) {
      this.productsService.getProduct(this.id).subscribe({
        next: (result) => {
          this.product = { ...result };
          this.title = `Editar - ${this.product.name}`;
          this.form.patchValue(this.product);
        },
        error: (error) => console.error(error),
      });

      this.productsService.getProductFeatures(this.id).subscribe({
        next: (result) => {
          this.selectedFeatures = [...result];
          this.alreadySelectedFeatures = [...result];
        },
        error: (error) => console.error(error),
      });

      this.productsService.getProductCategories(this.id).subscribe({
        next: (result) => {
          this.chipList.value = result.map((c) => c.id);
          this.alreadySelectedCategories = result.map((c) => c.id);
        },
        error: (error) => console.error(error),
      });
    } else {
      this.title = 'Nuevo producto';
    }
  }

  addFeature(): void {
    if (this.featuresForm.invalid) {
      return;
    }

    const { id, name } = this.featuresForm.controls['feature'].value;
    const content = this.featuresForm.controls['content'].value;

    this.selectedFeatures.push({
      id,
      name,
      content,
    });

    this.availableFeatures = this.availableFeatures.filter(
      (feature) => feature.id != id
    );

    this.featuresForm.reset();
  }

  removeFeature(feature: ProductFeature) {
    const index = this.selectedFeatures.indexOf(feature);
    this.selectedFeatures.splice(index, 1);
    this.availableFeatures.push({
      id: feature.id,
      name: feature.name,
    });
  }

  onSubmit(): void {
    const product = this.product ? this.product : <Product>{};
    product.name = this.form.controls['name'].value;

    if (this.id) {
      this.submitProductUpdate(product);
    } else {
      this.submitProductCreation(product);
    }

    this.router.navigate(['/admin/panel/productos']);
  }

  async submitProductUpdate(product: Product): Promise<void> {
    product.id = this.id!;

    const productUpdateResult = await lastValueFrom(
      this.productsService.updateProduct(product)
    );

    if (!productUpdateResult.ok) {
      console.log(productUpdateResult.body);
      return;
    }

    // Applying categories changes
    const categoriesToDelete = this.alreadySelectedCategories.filter(
      (c) => !this.chipList.value.includes(c)
    );

    for (let cat of categoriesToDelete) {
      const result = await lastValueFrom(
        this.productsService.deleteProductCategory(product.id, cat)
      );
      if (result.ok) {
        console.log(`Categoria ${cat} borrada`);
      }
    }

    const categoriesToAdd = this.chipList.value.filter(
      (c: number) => !this.alreadySelectedCategories.includes(c)
    );

    for (let cat of categoriesToAdd) {
      const result = await lastValueFrom(
        this.productsService.addCategoryToProduct({
          categoryId: cat,
          productId: product.id,
        })
      );

      if (result.ok) {
        console.log(`Categoria ${cat} agregada.`);
      }
    }

    // Applying feature changes
    const featuresToDelete = this.alreadySelectedFeatures.filter(
      (feat) => !this.selectedFeatures.includes(feat)
    );

    for (let feat of featuresToDelete) {
      const result = await lastValueFrom(
        this.productsService.deleteProductFeature(product.id, feat.id)
      );

      if (result.ok) {
        console.log(`Feature ${feat.name} deleted`);
      }
    }

    const featuresToAdd = this.selectedFeatures.filter((selectedFeatures) => {
      return !this.alreadySelectedFeatures.includes(selectedFeatures);
    });

    for (let feat of featuresToAdd) {
      const result = await lastValueFrom(
        this.productsService.addFeatureToProduct({
          content: feat.content,
          featureId: feat.id,
          productId: product.id,
        })
      );

      if (result.ok) {
        console.log(`Feature ${feat.name} added`);
      }
    }
  }

  submitProductCreation(product: Product): void {
    this.productsService.addProduct(product).subscribe({
      next: (result) => {
        this.router.navigate(['/admin/panel/productos']);
      },
      error: (error) => console.error(error),
    });
  }
}
