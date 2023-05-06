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
import { FeatureService } from 'src/app/feature.service';
import { BaseFormComponent } from 'src/app/shared/components/base-form.component';
import Feature from 'src/app/shared/models/Feature';

@Component({
  selector: 'app-feature-edit',
  templateUrl: './feature-edit.component.html',
  styleUrls: ['./feature-edit.component.scss'],
})
export class FeatureEditComponent extends BaseFormComponent implements OnInit {
  title?: string;
  feature?: Feature;
  id?: number;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private featuresService: FeatureService
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
      this.featuresService.getFeature(this.id).subscribe({
        next: (result) => {
          this.feature = result;
          this.title = `Editar - ${this.feature.name}`;
          this.form.patchValue(this.feature);
        },
        error: (error) => console.error(error),
      });
    } else {
      this.title = 'Nueva característica';
    }
  }

  onSubmit(): void {
    const feature = this.feature ? this.feature : <Feature>{};
    feature.name = this.form.controls['name'].value;

    if (this.id) {
      // Modo de edicion
      feature.id = this.id;
      this.featuresService.updateFeature(feature).subscribe({
        next: (result) => {
          this.router.navigate(['/admin/panel/caracteristicas']);
        },
        error: (error) => console.error(error),
      });
    } else {
      // Modo de creacion
      this.featuresService.addFeature(feature.name).subscribe({
        next: (result) => {
          this.router.navigate(['/admin/panel/caracteristicas']);
        },
        error: (error) => console.error(error),
      });
    }
  }

  featureIsUnique(): AsyncValidatorFn {
    return (control: AbstractControl): Observable<ValidationErrors | null> => {
      return this.featuresService
        .isNameUnique(control.value)
        .pipe(map((result) => (result ? { nameTaken: true } : null)));
    };
  }
}
