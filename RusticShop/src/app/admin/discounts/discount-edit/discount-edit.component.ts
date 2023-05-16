import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { DiscountsService } from 'src/app/services/discounts.service';
import { BaseFormComponent } from 'src/app/shared/components/base-form.component';
import Discount from 'src/app/shared/models/Discount';

@Component({
  selector: 'app-discount-edit',
  templateUrl: './discount-edit.component.html',
  styleUrls: ['./discount-edit.component.scss'],
})
export class DiscountEditComponent extends BaseFormComponent implements OnInit {
  title?: string;
  discount?: Discount;
  id?: number;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private discountsService: DiscountsService
  ) {
    super();
  }

  ngOnInit(): void {
    this.form = new FormGroup({
      name: new FormControl('', [Validators.required]),
      description: new FormControl('', [Validators.required]),
    });

    this.loadData();
  }

  loadData(): void {
    const idParam = this.route.snapshot.paramMap.get('id');
    this.id = idParam ? +idParam : 0;

    if (this.id) {
      this.discountsService.getById(this.id).subscribe({
        next: (result) => {
          this.discount = result;
          this.title = `Editar - ${this.discount.name}`;
          this.form.patchValue(this.discount);
        },
        error: (error) => console.error(error),
      });
    } else {
      this.title = 'Nuevo descuento';
    }
  }

  onSubmit(): void {
    const discount = this.discount ? this.discount : <Discount>{};
    discount.name = this.form.controls['name'].value;
    discount.description = this.form.controls['description'].value;

    if (this.id) {
      // Modo de edicion
      discount.id = this.id;
      this.discountsService.update(discount).subscribe({
        next: (result) => {
          this.router.navigate(['/admin/panel/descuentos']);
        },
        error: (error) => console.error(error),
      });
    } else {
      // Modo de creacion
      this.discountsService.create(discount).subscribe({
        next: (result) => {
          this.router.navigate(['/admin/panel/descuentos']);
        },
        error: (error) => console.error(error),
      });
    }
  }
}
