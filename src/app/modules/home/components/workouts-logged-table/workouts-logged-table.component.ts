import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import {
  LoggedTableComponent,
  LogEntry,
} from '@app/shared/components/logged-table/logged-table.component';
import {
  AddEntryDialogComponent,
  AddEntryDialogData,
  AddEntryFormValue,
} from '@app/shared/components/add-entry-dialog/add-entry-dialog.component';
import { take, map, filter } from 'rxjs';
import { Store } from '@ngrx/store';
import {
  selectTodaysWorkouts,
  selectWorkoutsIsLoading,
} from '@app/core/stores/workouts/workouts.selectors';
import { selectCurrentUserId } from '@app/core/stores/auth/auth.selectors';
import * as WorkoutsActions from '@app/core/stores/workouts/workouts.actions';
import { WorkoutEntry } from '@app/core/models/interfaces';

const MUI = [MatButtonModule, MatIconModule, MatDialogModule];

const COMPONENTS = [LoggedTableComponent];

@Component({
  selector: 'app-workouts-logged-table',
  templateUrl: './workouts-logged-table.component.html',
  styleUrls: ['./workouts-logged-table.component.scss'],
  standalone: true,
  imports: [CommonModule, ...MUI, ...COMPONENTS],
})
export class WorkoutsLoggedTableComponent {
  private dialog = inject(MatDialog);
  private store = inject(Store);

  workouts$ = this.store
    .select(selectTodaysWorkouts)
    .pipe(map((workouts) => workouts?.map(this.mapWorkoutToLogEntry) || []));
  isLoading$ = this.store.select(selectWorkoutsIsLoading);
  currentUserId$ = this.store.select(selectCurrentUserId);

  openAddWorkoutDialog(): void {
    const dialogRef = this.dialog.open(AddEntryDialogComponent, {
      width: '500px',
      disableClose: false,
      data: this.getWorkoutDialogConfig(),
    });

    // After the dialog is closed, we need to add the workout to the store
    dialogRef
      .afterClosed()
      .pipe(
        take(1),
        filter((result) => !!result)
      )
      .subscribe((result) => {
        // if there is no result, don't add the workout to the store
        if (result) {
          const formValue: AddEntryFormValue = result;
          this.currentUserId$.pipe(take(1)).subscribe((userId) => {
            if (userId) {
              // Create workout data
              const workoutData: WorkoutEntry = {
                id: '',
                userId,
                createdAt: formValue.datetime ?? new Date(),
                name: formValue.name,
                category: formValue.category,
                calories: formValue.calories,
                source: 'manual',
              };

              this.store.dispatch(
                WorkoutsActions.addWorkout({ workout: workoutData })
              );
            }
          });
        }
      });
  }

  private mapWorkoutToLogEntry(workout: WorkoutEntry): LogEntry {
    return {
      name: workout.name,
      category: workout.category,
      calories: -workout.calories, // Negative calories for workouts (calories burned)
      source: workout.source,
      createdAt: workout.createdAt,
    };
  }

  private getWorkoutDialogConfig(): AddEntryDialogData {
    return {
      title: 'Add Workout',
      icon: 'fitness_center',
      nameLabel: 'Workout Name',
      namePlaceholder: 'e.g., Morning Run',
      categoryLabel: 'Category',
      categoryPlaceholder: 'e.g., Running, Yoga, Weight Training',
      caloriesLabel: 'Calories Burned',
      caloriesPlaceholder: 'e.g., 300',
      datetimeLabel: 'Date',
      timeLabel: 'Time',
      submitButtonText: 'Add Workout',
    };
  }
}
