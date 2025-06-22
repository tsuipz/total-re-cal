import { Injectable, inject } from '@angular/core';
import {
  FormBuilder,
  FormControl,
  FormGroup,
  Validators,
} from '@angular/forms';
import { CheckInDay } from '../../../../../core/models/types/user.type';
import { PlanFormService } from '../plan/plan.form.service';
import { ProfileFormService } from '../profile/profile.form.service';
import { CalorieCalculationService } from '../../../../../core/services/calorie-calculation.service';

export interface CheckInFormValue {
  checkInDay: CheckInDay;
}

export interface CheckInFormControls {
  checkInDay: FormControl<CheckInDay>;
}

export type CheckInForm = FormGroup<CheckInFormControls>;

@Injectable()
export class CheckInFormService {
  private fb = inject(FormBuilder);
  private planFormService = inject(PlanFormService);
  private profileFormService = inject(ProfileFormService);
  private calorieCalculationService = inject(CalorieCalculationService);

  private checkInForm: CheckInForm = this.fb.group<CheckInFormControls>({
    checkInDay: this.fb.control<CheckInDay>('Monday', {
      nonNullable: true,
      validators: [Validators.required],
    }),
  });

  public get form(): CheckInForm {
    return this.checkInForm;
  }

  public get value(): CheckInFormValue {
    return this.checkInForm.value as CheckInFormValue;
  }

  public get isValid(): boolean {
    return this.checkInForm.valid;
  }

  public reset(): void {
    this.checkInForm.reset({ checkInDay: 'Monday' });
  }

  get firstWeekCalorieTargetRange(): { min: number; max: number } | null {
    const profileData = this.profileFormService.profileDataForCalculations;
    const weeklyLoss = this.planFormService.selectedPlanData?.weeklyLoss;

    if (
      !profileData.age ||
      !profileData.gender ||
      !profileData.heightCm ||
      !profileData.currentWeightKg ||
      !weeklyLoss
    ) {
      return null;
    }

    const target = this.calorieCalculationService.calculateDailyCalorieTarget(
      {
        age: profileData.age,
        gender: profileData.gender,
        heightCm: profileData.heightCm,
        currentWeightKg: profileData.currentWeightKg,
      },
      weeklyLoss
    );

    return {
      min: target - 100,
      max: target + 100,
    };
  }
}
