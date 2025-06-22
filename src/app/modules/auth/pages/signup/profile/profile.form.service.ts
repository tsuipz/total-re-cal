import { inject, Injectable } from '@angular/core';
import {
  FormBuilder,
  FormControl,
  FormGroup,
  Validators,
} from '@angular/forms';
import { Gender, UnitSystem } from '@models/types';

export interface ProfileFormValue {
  name: string;
  gender: Gender;
  age: number;
  height: number;
  currentWeight: number;
  unitSystem: UnitSystem;
}

export interface ProfileFormControls {
  name: FormControl<string | null>;
  gender: FormControl<string | null>;
  age: FormControl<number | null>;
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
    age: this.fb.control<number | null>(null, [
      Validators.required,
      Validators.min(13),
      Validators.max(120),
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
}
