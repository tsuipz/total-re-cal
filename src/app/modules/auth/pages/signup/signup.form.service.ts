import { Injectable, inject } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import {
  ProfileForm,
  ProfileFormService,
  ProfileFormValue,
} from './profile/profile.form.service';
import {
  PlanForm,
  PlanFormService,
  PlanFormValue,
} from './plan/plan.form.service';
import {
  CheckInForm,
  CheckInFormService,
  CheckInFormValue,
} from './check-in/check-in.form.service';

export interface SignupFormValue {
  profile: ProfileFormValue;
  plan: PlanFormValue;
  checkIn: CheckInFormValue;
}

export interface SignupFormControls {
  profile: ProfileForm;
  plan: PlanForm;
  checkIn: CheckInForm;
}

export type SignupForm = FormGroup<SignupFormControls>;

@Injectable()
export class SignupFormService {
  private fb = inject(FormBuilder);
  private profileFormService = inject(ProfileFormService);
  private planFormService = inject(PlanFormService);
  private checkInFormService = inject(CheckInFormService);

  private signupForm: SignupForm = this.fb.group<SignupFormControls>({
    profile: this.profileFormService.form,
    plan: this.planFormService.form,
    checkIn: this.checkInFormService.form,
  });

  public get form(): SignupForm {
    return this.signupForm;
  }

  public get value(): SignupFormValue {
    return this.signupForm.value as SignupFormValue;
  }

  public get isValid(): boolean {
    return this.signupForm.valid;
  }
}
