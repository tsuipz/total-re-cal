import { Component, inject, OnDestroy } from '@angular/core';
import { ProfileComponent } from './profile/profile.component';
import { PlanComponent } from './plan/plan.component';
import { CheckInComponent } from './check-in/check-in.component';
import { CommonModule } from '@angular/common';
import { SignupFormService } from './signup.form.service';
import { ProfileFormService } from './profile/profile.form.service';
import { PlanFormService } from './plan/plan.form.service';
import { CheckInFormService } from './check-in/check-in.form.service';
import { Store } from '@ngrx/store';
import { Subject } from 'rxjs';
import { AuthActions } from '@core/stores/auth';

// Material Imports
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatStepperModule } from '@angular/material/stepper';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { AuthSelectors } from '@app/core/stores/auth';
import { User } from '@app/core/models/interfaces';

const SERVICES = [
  SignupFormService,
  ProfileFormService,
  PlanFormService,
  CheckInFormService,
];

@Component({
  selector: 'app-signup',
  imports: [
    CommonModule,
    ProfileComponent,
    PlanComponent,
    CheckInComponent,
    MatCardModule,
    MatButtonModule,
    MatStepperModule,
    MatProgressSpinnerModule,
  ],
  templateUrl: './signup.component.html',
  styleUrl: './signup.component.scss',
  providers: [SERVICES],
})
export class SignupComponent implements OnDestroy {
  private signupFormService = inject(SignupFormService);
  private store = inject(Store);
  private destroy$ = new Subject<void>();

  public isLoading$ = this.store.select(AuthSelectors.selectIsLoading);

  public currentStep = 0;
  public totalSteps = 3;

  public get isFormValid(): boolean {
    // If on first step, check if first step is valid
    if (this.currentStep === 0) {
      return this.signupFormService.isFirstStepValid;
    }
    // If on second step, check if second step is valid
    if (this.currentStep === 1) {
      return this.signupFormService.isSecondStepValid;
    }
    // If on third step, check if third step is valid
    if (this.currentStep === 2) {
      return this.signupFormService.isThirdStepValid;
    }

    return false;
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  onHandleNext(): void {
    if (this.currentStep < this.totalSteps - 1) {
      this.currentStep++;
    } else if (this.currentStep === this.totalSteps - 1) {
      this.completeSignup();
    }
  }

  onHandleBack(): void {
    if (this.currentStep > 0) {
      this.currentStep--;
    }
  }

  private completeSignup(): void {
    // Get form data from all steps
    const signupData = this.signupFormService.value;
    const { profile, plan, checkIn } = signupData;

    // Create user profile object
    const userProfile: User = {
      uid: '', // Will be set by the service
      email: '', // Will be set by the service
      createdAt: new Date(), // Will be set by the service
      name: profile.name,
      gender: profile.gender,
      birthday: profile.birthday,
      height: profile.height,
      currentWeight: profile.currentWeight,
      unitSystem: profile.unitSystem,
      goalWeight: plan.goalWeight,
      goalPlan: plan.goalPlan,
      checkInDay: checkIn.checkInDay,
    };

    // Dispatch action to save user profile
    this.store.dispatch(AuthActions.saveUserProfile({ user: userProfile }));
  }

  get stepTitle(): string {
    switch (this.currentStep) {
      case 0:
        return 'Tell us about yourself';
      case 1:
        return 'Choose your weight loss plan';
      case 2:
        return 'Set up your check-in schedule';
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
      case 2:
        return "Choose when you'd like to receive weight check-in reminders";
      default:
        return '';
    }
  }
}
