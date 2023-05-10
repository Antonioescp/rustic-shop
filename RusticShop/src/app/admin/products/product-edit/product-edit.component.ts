import { Component, OnInit, ViewChild } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { MatChipListbox } from '@angular/material/chips';
import { ActivatedRoute, Router } from '@angular/router';
import { ProductsService } from 'src/app/products.service';
import { BaseFormComponent } from 'src/app/shared/components/base-form.component';
import { Product } from 'src/app/shared/models/Product';
import { lastValueFrom } from 'rxjs';
import Brand from 'src/app/shared/models/Brand';
import { BrandsService } from '../../../brands.service';

@Component({
  selector: 'app-product-edit',
  templateUrl: './product-edit.component.html',
  styleUrls: ['./product-edit.component.scss'],
})
export class ProductEditComponent extends BaseFormComponent implements OnInit {
  title?: string;
  product?: Product;
  id?: number;

  // TODO create brand service and get brands
  brands: Brand[] = [];

  @ViewChild(MatChipListbox) chipList!: MatChipListbox;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private productsService: ProductsService,
    private brandsService: BrandsService,
  ) {
    super();
  }

  ngOnInit(): void {
    this.form = new FormGroup({
      name: new FormControl('', [Validators.required]),
      brandId: new FormControl(0, [Validators.required]),
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

    this.loadData();
  }

  loadData(): void {
    const idParam = this.route.snapshot.paramMap.get('id');
    this.id = idParam ? +idParam : 0;

    if (this.id) {
      this.productsService.getProduct(this.id).subscribe({
        next: (result) => {
          this.product = { ...result };
          this.title = `Editar - ${this.product.name}`;
          this.form.patchValue(this.product);
        },
        error: (error) => console.error(error),
      });
    } else {
      this.title = 'Nuevo producto';
    }

    // Getting brands
    this.brandsService.getAll().subscribe({
      next: brands => this.brands = brands,
      error: err => console.error(err)
    });
  }

  onSubmit(): void {
    const product = this.product ? this.product : <Product>{};
    product.brandId = +this.form.controls['brandId'].value;
    product.name = this.form.controls['name'].value;
    product.description = this.form.controls['description'].value;
    product.shortDescription = this.form.controls['shortDescription'].value;
    product.isPublished = this.form.controls['isPublished'].value;

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
  }

  submitProductCreation(product: Product): void {
    this.productsService.addProduct(product).subscribe({
      next: (result) => {
        console.log(`product added ${result}`);
      },
      error: (error) => console.error(error),
    });
  }
}
