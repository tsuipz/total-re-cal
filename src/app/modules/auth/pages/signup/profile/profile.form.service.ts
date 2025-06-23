import { inject, Injectable } from '@angular/core';
import {
  AbstractControl,
  FormBuilder,
  FormControl,
  FormGroup,
  ValidationErrors,
  Validators,
} from '@angular/forms';
import { profileDataForCalculations } from '@app/shared/utils/calories.util';
import { Gender, UnitSystem } from '@models/types';

function ageValidator(control: AbstractControl): ValidationErrors | null {
  if (control.value) {
    const birthday = new Date(control.value);
    const today = new Date();
    let age = today.getFullYear() - birthday.getFullYear();
    const m = today.getMonth() - birthday.getMonth();
    if (m < 0 || (m === 0 && today.getDate() < birthday.getDate())) {
      age--;
    }
    if (age < 13) {
      return { underAge: true };
    }
  }
  return null;
}

export interface ProfileFormValue {
  name: string;
  gender: Gender;
  birthday: Date;
  height: number;
  currentWeight: number;
  unitSystem: UnitSystem;
}

export interface ProfileFormControls {
  name: FormControl<string | null>;
  gender: FormControl<string | null>;
  birthday: FormControl<Date | null>;
  height: FormControl<number | null>;
  currentWeight: FormControl<number | null>;
  unitSystem: FormControl<UnitSystem | null>;
}

export type ProfileForm = FormGroup<ProfileFormControls>;

@Injectable()
export class ProfileFormService {
  private fb = inject(FormBuilder);
  private _form: ProfileForm = this.fb.group<ProfileFormControls>({
    name: this.fb.control<string | null>(null, [
      Validators.required,
      Validators.minLength(2),
      Validators.maxLength(100),
    ]),
    gender: this.fb.control<Gender | null>(null, [Validators.required]),
    birthday: this.fb.control<Date | null>(null, [
      Validators.required,
      ageValidator,
    ]),
    height: this.fb.control<number | null>(null, [
      Validators.required,
      Validators.min(1),
    ]),
    currentWeight: this.fb.control<number | null>(null, [
      Validators.required,
      Validators.min(1),
    ]),
    unitSystem: this.fb.control<UnitSystem | null>('imperial', [
      Validators.required,
    ]),
  });

  public get form(): ProfileForm {
    return this._form;
  }

  public get isValid(): boolean {
    return this.form.valid;
  }

  public get formValue(): ProfileFormValue {
    return this.form.getRawValue() as ProfileFormValue;
  }

  public get currentWeight(): number | null {
    return this.form.controls.currentWeight.value;
  }

  public get profileDataForCalculations() {
    const { gender, birthday, height, currentWeight, unitSystem } =
      this.formValue;

    return profileDataForCalculations(
      gender,
      birthday,
      height,
      currentWeight,
      unitSystem
    );
  }
}
