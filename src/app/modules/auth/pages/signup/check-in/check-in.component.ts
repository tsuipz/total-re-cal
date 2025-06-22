import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';

import { CheckInFormService } from './check-in.form.service';
import { CheckInDay } from '../../../../../core/models/types/user.type';
import { PlanFormService, WeightLossPlan } from '../plan/plan.form.service';

@Component({
  selector: 'app-check-in',
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatSelectModule,
    MatCardModule,
    MatIconModule,
  ],
  templateUrl: './check-in.component.html',
  styleUrl: './check-in.component.scss',
  providers: [CheckInFormService],
})
export class CheckInComponent {
  private checkInFormService = inject(CheckInFormService);
  private planFormService = inject(PlanFormService);

  public get form() {
    return this.checkInFormService.form;
  }

  public get isValid(): boolean {
    return this.checkInFormService.isValid;
  }

  public get value() {
    return this.checkInFormService.value;
  }

  get selectedPlanData(): WeightLossPlan | null {
    return this.planFormService.selectedPlanData;
  }

  get goalWeight(): number | null {
    return this.planFormService.goalWeight;
  }

  get firstWeekCalorieTargetRange(): { min: number; max: number } | null {
    return this.checkInFormService.firstWeekCalorieTargetRange;
  }

  readonly checkInDays: CheckInDay[] = [
    'Monday',
    'Tuesday',
    'Wednesday',
    'Thursday',
    'Friday',
    'Saturday',
    'Sunday',
  ];
}
