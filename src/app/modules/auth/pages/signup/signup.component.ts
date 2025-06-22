import { Component } from '@angular/core';
import { ProfileComponent } from './profile/profile.component';
import { PlanComponent } from './plan/plan.component';
import { CommonModule } from '@angular/common';
import { SignupFormService } from './signup.form.service';
import { ProfileFormService } from './profile/profile.form.service';
import { PlanFormService } from './plan/plan.form.service';

// Material Imports
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatStepperModule } from '@angular/material/stepper';

const SERVICES = [SignupFormService, ProfileFormService, PlanFormService];

@Component({
  selector: 'app-signup',
  imports: [
    CommonModule,
    ProfileComponent,
    PlanComponent,
    MatCardModule,
    MatButtonModule,
    MatStepperModule,
  ],
  templateUrl: './signup.component.html',
  styleUrl: './signup.component.scss',
  providers: [SERVICES],
})
export class SignupComponent {
  currentStep = 0;
  totalSteps = 2;

  onHandleNext(): void {
    if (this.currentStep < this.totalSteps - 1) {
      this.currentStep++;
    }
  }

  onHandleBack(): void {
    if (this.currentStep > 0) {
      this.currentStep--;
    }
  }

  get stepTitle(): string {
    switch (this.currentStep) {
      case 0:
        return 'Tell us about yourself';
      case 1:
        return 'Choose your weight loss plan';
      default:
        return 'Sign Up';
    }
  }

  get stepSubtitle(): string {
    switch (this.currentStep) {
      case 0:
        return 'This information helps us personalize your experience';
      case 1:
        return 'Select a plan that fits your lifestyle and goals';
      default:
        return '';
    }
  }
}
