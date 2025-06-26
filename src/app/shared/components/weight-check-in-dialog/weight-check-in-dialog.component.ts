import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import {
  MAT_DIALOG_DATA,
  MatDialogActions,
  MatDialogContent,
  MatDialogRef,
  MatDialogTitle,
} from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatCardModule } from '@angular/material/card';
import { Store } from '@ngrx/store';
import { UnitSystem } from '@app/core/models/types';
import { WeightsActions, WeightsSelectors } from '@app/core/stores/weights';
import { filter, take, race } from 'rxjs';

const MUI = [
  MatFormFieldModule,
  MatInputModule,
  MatButtonModule,
  MatDialogTitle,
  MatDialogContent,
  MatDialogActions,
  MatIconModule,
  MatProgressSpinnerModule,
  MatCardModule,
];

export interface WeightCheckInDialogData {
  userId: string;
  unitSystem: UnitSystem;
}

@Component({
  selector: 'app-weight-check-in-dialog',
  templateUrl: './weight-check-in-dialog.component.html',
  styleUrls: ['./weight-check-in-dialog.component.scss'],
  imports: [CommonModule, ReactiveFormsModule, ...MUI],
  standalone: true,
})
export class WeightCheckInDialogComponent {
  private fb = inject(FormBuilder);
  private dialogRef = inject(MatDialogRef<WeightCheckInDialogComponent>);
  private data = inject<WeightCheckInDialogData>(MAT_DIALOG_DATA);
  private store = inject(Store);

  public form = this.fb.group({
    weight: this.fb.control<number | null>(null, [
      Validators.required,
      Validators.min(50),
      Validators.max(500),
    ]),
  });

  public isLoading$ = this.store.select(WeightsSelectors.selectWeightIsLoading);
  public isSubmitting = false;
  public previousWeight$ = this.store.select(
    WeightsSelectors.selectPreviousWeightCheckIn
  );
  public weightDifference: number | null = null;
  public weightUnit: string;

  constructor() {
    this.weightUnit = this.data.unitSystem === 'imperial' ? 'lbs' : 'kg';
  }

  public onWeightChange(): void {
    const currentWeight = this.form.controls.weight.value;
    this.previousWeight$.pipe(take(1)).subscribe((previousWeight) => {
      if (currentWeight && previousWeight) {
        this.weightDifference = currentWeight - previousWeight.weight;
      } else {
        this.weightDifference = null;
      }
    });
  }

  public onSubmit(): void {
    if (this.form.invalid || this.isSubmitting) {
      return;
    }

    this.isSubmitting = true;
    const weight = this.form.controls.weight.value!;

    this.store.dispatch(WeightsActions.addWeightCheckIn({ weight }));

    // Create observables for success and error
    const success$ = this.store
      .select(WeightsSelectors.selectLatestWeightCheckIn)
      .pipe(
        filter((checkIn) => checkIn !== null && checkIn.weight === weight),
        take(1)
      );

    const error$ = this.store.select(WeightsSelectors.selectWeightError).pipe(
      filter((error) => error !== null),
      take(1)
    );

    // Race between success and error
    race(success$, error$).subscribe((result) => {
      this.isSubmitting = false;

      if (result && 'weight' in result) {
        // Success case
        this.dialogRef.close(result);
      } else {
        // Error case - could show error message
        // Error handling could be added here
      }
    });
  }

  public onCancel(): void {
    this.dialogRef.close();
  }

  public getWeightDifferenceText(): string {
    if (this.weightDifference === null) {
      return '';
    }

    const absDifference = Math.abs(this.weightDifference);
    const direction = this.weightDifference > 0 ? 'gained' : 'lost';

    return `You've ${direction} ${absDifference.toFixed(1)} ${this.weightUnit}`;
  }

  public getWeightDifferenceColor(): string {
    if (this.weightDifference === null) {
      return '';
    }

    // For weight loss goals, negative difference is good (green)
    // For weight gain goals, positive difference is good (green)
    // This is a simplified logic - you might want to make this more sophisticated
    return this.weightDifference < 0 ? 'success' : 'warn';
  }
}
