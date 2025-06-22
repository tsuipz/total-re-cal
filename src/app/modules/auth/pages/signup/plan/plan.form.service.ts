import { inject, Injectable } from '@angular/core';
import {
  FormBuilder,
  FormControl,
  FormGroup,
  Validators,
} from '@angular/forms';
import { GoalPlan } from '@models/types';
import { ProfileFormService } from '../profile/profile.form.service';
import { CalorieCalculationService } from '@core/services/calorie-calculation.service';

export interface WeightLossPlan {
  type: GoalPlan;
  weeklyLoss: number;
  estimatedDuration: number;
  description: string;
}

export interface PlanFormValue {
  goalWeight: number;
  goalPlan: GoalPlan;
}

export interface PlanFormControls {
  goalWeight: FormControl<number | null>;
  goalPlan: FormControl<GoalPlan | null>;
}

export type PlanForm = FormGroup<PlanFormControls>;

@Injectable()
export class PlanFormService {
  private fb = new FormBuilder();
  private profileFormService = inject(ProfileFormService);
  private calorieCalculationService = inject(CalorieCalculationService);

  public form: PlanForm = this.fb.group<PlanFormControls>({
    goalWeight: this.fb.control<number | null>(null, [Validators.required]),
    goalPlan: this.fb.control<GoalPlan | null>(null, [Validators.required]),
  });

  public readonly weightLossPlans: WeightLossPlan[] = [
    {
      type: 'slow',
      weeklyLoss: 0.5,
      estimatedDuration: 12,
      description: 'Gradual, sustainable weight loss',
    },
    {
      type: 'moderate',
      weeklyLoss: 1.0,
      estimatedDuration: 8,
      description: 'Balanced approach for steady progress',
    },
    {
      type: 'aggressive',
      weeklyLoss: 2.0,
      estimatedDuration: 4,
      description: 'Fast-paced weight loss journey',
    },
  ];

  get currentWeight(): number | null {
    return this.profileFormService.currentWeight;
  }

  get selectedPlanData(): WeightLossPlan | null {
    const selectedPlan = this.form.controls.goalPlan.value;
    return (
      this.calculatedWeightLossPlan.find(
        (plan) => plan.type === selectedPlan
      ) || null
    );
  }

  get goalWeight(): number | null {
    return this.form.controls.goalWeight.value;
  }

  get selectedPlan(): GoalPlan | null {
    return this.form.controls.goalPlan.value;
  }

  get firstWeekCalorieTargetRange(): { min: number; max: number } | null {
    const profileData = this.profileFormService.profileDataForCalculations;
    const weeklyLoss = this.selectedPlanData?.weeklyLoss;

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

  public get calculatedWeightLossPlan(): WeightLossPlan[] {
    const currentWeight = this.currentWeight;
    const goalWeight = this.goalWeight;
    if (!currentWeight || !goalWeight) {
      return this.weightLossPlans;
    }

    return this.weightLossPlans.map((plan) => {
      const estimatedDuration = (currentWeight - goalWeight) / plan.weeklyLoss;

      return {
        ...plan,
        estimatedDuration,
      };
    });
  }

  reset(): void {
    this.form.reset();
  }
}
