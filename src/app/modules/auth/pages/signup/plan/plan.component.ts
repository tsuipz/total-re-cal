import { Component, inject, ChangeDetectionStrategy } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

// Material Imports
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatButtonToggleModule } from '@angular/material/button-toggle';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatIconModule } from '@angular/material/icon';
import { MatChipsModule } from '@angular/material/chips';

import { PlanFormService, WeightLossPlan } from './plan.form.service';
import { GoalPlan } from '@models/types';

@Component({
  selector: 'app-plan',
  imports: [
    ReactiveFormsModule,
    CommonModule,
    MatCardModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatButtonToggleModule,
    MatProgressSpinnerModule,
    MatIconModule,
    MatChipsModule,
  ],
  templateUrl: './plan.component.html',
  styleUrl: './plan.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PlanComponent {
  private planFormService = inject(PlanFormService);

  public planForm = this.planFormService.form;
  public get calculatedWeightLossPlan(): WeightLossPlan[] {
    return this.planFormService.calculatedWeightLossPlan;
  }
  public isSubmitting = false;

  selectPlan(planType: GoalPlan): void {
    this.planForm.controls.goalPlan.setValue(planType);
  }
}
