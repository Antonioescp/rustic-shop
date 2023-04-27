import { Component } from '@angular/core';
import { FormGroup, AbstractControl } from '@angular/forms';

@Component({
  template: ''
})
export abstract class BaseFormComponent {
  form!: FormGroup;

  getErrors(
    control: AbstractControl,
    displayName: string,
    customMessages: { [key: string]: string } | null = null
  ): string[] {
    var errors: string[] = [];
    Object.keys(control.errors || {}).forEach((key) => {
      switch (key) {
        case 'required':
          errors.push(`${displayName} ${customMessages?.[key] ?? 'es requerido.'}`);
          break;
        case 'pattern':
          errors.push(`${displayName} ${customMessages?.[key] ?? 'contiene caracteres inválidos.'}`);
          break;
        case 'isDupeField':
          errors.push(`${displayName} ${customMessages?.[key] ?? 'ya existe: por favor escoja otro.'}`);
          break;
        default:
          errors.push(`${displayName} ${customMessages?.[key] ?? 'es invalido.'}`);
          break;
      }
    });
    return errors;
  }

  constructor() { }
}
