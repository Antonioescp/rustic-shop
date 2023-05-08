import { Component, OnInit } from '@angular/core';
import { AbstractControl } from '@angular/forms';
import {
  AsyncValidatorFn,
  FormControl,
  FormGroup,
  ValidationErrors,
  Validators,
} from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { Observable, map } from 'rxjs';
import { AttributesService } from 'src/app/attributes.service';
import { BaseFormComponent } from 'src/app/shared/components/base-form.component';
import Attribute from 'src/app/shared/models/Attribute';

@Component({
  selector: 'app-attribute-edit',
  templateUrl: './attribute-edit.component.html',
  styleUrls: ['./attribute-edit.component.scss'],
})
export class AttributeEditComponent
  extends BaseFormComponent
  implements OnInit
{
  title?: string;
  attribute?: Attribute;
  id?: number;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private featuresService: AttributesService
  ) {
    super();
  }

  ngOnInit(): void {
    this.form = new FormGroup({
      name: new FormControl('', [Validators.required], this.featureIsUnique()),
    });

    this.loadData();
  }

  loadData(): void {
    const idParam = this.route.snapshot.paramMap.get('id');
    this.id = idParam ? +idParam : 0;

    if (this.id) {
      this.featuresService.getAttribute(this.id).subscribe({
        next: (result) => {
          this.attribute = result;
          this.title = `Editar - ${this.attribute.name}`;
          this.form.patchValue(this.attribute);
        },
        error: (error) => console.error(error),
      });
    } else {
      this.title = 'Nueva característica';
    }
  }

  onSubmit(): void {
    const attribute = this.attribute ? this.attribute : <Attribute>{};
    attribute.name = this.form.controls['name'].value;

    if (this.id) {
      // Modo de edicion
      attribute.id = this.id;
      this.featuresService.updateAttribute(attribute).subscribe({
        next: (result) => {
          this.router.navigate(['/admin/panel/caracteristicas']);
        },
        error: (error) => console.error(error),
      });
    } else {
      // Modo de creacion
      this.featuresService.addAttribute(attribute.name).subscribe({
        next: (result) => {
          this.router.navigate(['/admin/panel/caracteristicas']);
        },
        error: (error) => console.error(error),
      });
    }
  }

  featureIsUnique(): AsyncValidatorFn {
    return (control: AbstractControl): Observable<ValidationErrors | null> => {
      if (this.id && this.attribute && this.attribute.name == control.value) {
        return new Observable((sub) => sub.next(null));
      }

      return this.featuresService
        .isNameUnique(control.value)
        .pipe(map((isAvailable) => (isAvailable ? null : { nameTaken: true })));
    };
  }
}
