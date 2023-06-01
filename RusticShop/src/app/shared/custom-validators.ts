import { AbstractControl, ValidationErrors, ValidatorFn } from '@angular/forms';

export class CustomValidators {
  public static matchField =
    (targetFieldName: string): ValidatorFn =>
    (control: AbstractControl): ValidationErrors | null => {
      const targetField = control.parent?.get(targetFieldName);
      return targetField && control && targetField.value !== control.value
        ? { matchField: true }
        : null;
    };

  public static matchFields =
    (firstFieldName: string, secondFieldName: string): ValidatorFn =>
    (control: AbstractControl): ValidationErrors | null => {
      const firstField = control.get(firstFieldName);
      const secondField = control.get(secondFieldName);
      return firstField && secondField && firstField.value !== secondField.value
        ? { matchFields: true }
        : null;
    };

  public static validatePassword(
    control: AbstractControl<string>
  ): ValidationErrors | null {
    // patterns
    const lowercase = /[a-z]/;
    const uppercase = /[A-Z]/;
    const symbol = /[@$!%*?&]/;

    const errors: ValidationErrors = {};

    if (!lowercase.test(control.value)) {
      errors['lowercase'] = true;
    }

    if (!uppercase.test(control.value)) {
      errors['uppercase'] = true;
    }

    if (!symbol.test(control.value)) {
      errors['symbol'] = true;
    }

    return errors;
  }
}
