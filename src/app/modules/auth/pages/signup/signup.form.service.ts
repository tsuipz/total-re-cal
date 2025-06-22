import { Injectable, inject } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import {
  ProfileForm,
  ProfileFormService,
  ProfileFormValue,
} from './profile/profile.form.service';

export interface SignupFormValue {
  profile: ProfileFormValue;
}

export interface SignupFormControls {
  profile: ProfileForm;
}

export type SignupForm = FormGroup<SignupFormControls>;

@Injectable()
export class SignupFormService {
  private fb = inject(FormBuilder);
  private profileFormService = inject(ProfileFormService);

  private signupForm: SignupForm = this.fb.group<SignupFormControls>({
    profile: this.profileFormService.form,
  });

  public get form(): SignupForm {
    return this.signupForm;
  }
}
