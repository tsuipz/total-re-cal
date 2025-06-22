import { Component, OnInit } from '@angular/core';
import { WorkoutEntry } from '../../../../core/models/interfaces/workout.interface';
import { CommonModule } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import {
  LogEntry,
  LoggedTableComponent,
} from '@app/shared/components/logged-table/logged-table.component';
import {
  AddEntryDialogComponent,
  AddEntryDialogData,
} from '@app/shared/components/add-entry-dialog/add-entry-dialog.component';
import { take } from 'rxjs';
import { inject } from '@angular/core';

const MUI = [MatButtonModule, MatIconModule, MatDialogModule];

const COMPONENTS = [LoggedTableComponent];

@Component({
  selector: 'app-workouts-logged-table',
  templateUrl: './workouts-logged-table.component.html',
  styleUrls: ['./workouts-logged-table.component.scss'],
  standalone: true,
  imports: [CommonModule, ...MUI, ...COMPONENTS],
})
export class WorkoutsLoggedTableComponent implements OnInit {
  private dialog = inject(MatDialog);
  workouts: LogEntry[] = [];

  ngOnInit(): void {
    this.workouts = this.getMockWorkouts()
      .map((workout) => ({
        ...workout,
        calories: -workout.calories,
      }))
      .sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime());
  }

  openAddWorkoutDialog(): void {
    const dialogRef = this.dialog.open(AddEntryDialogComponent, {
      width: '500px',
      disableClose: false,
      data: this.getWorkoutDialogConfig(),
    });

    dialogRef
      .afterClosed()
      .pipe(take(1))
      .subscribe((result) => {
        if (result) {
          // TODO: Add the workout to the workouts array and save to backend
          // For now, this is a placeholder for the actual implementation
        }
      });
  }

  private getMockWorkouts(): WorkoutEntry[] {
    return [
      {
        id: '1',
        userId: '1',
        category: 'Running',
        name: 'Morning Run',
        calories: 280,
        source: 'photo',
        createdAt: new Date('2023-10-27T07:00:00'),
      },
      {
        id: '2',
        userId: '1',
        category: 'Yoga',
        name: 'Yoga Session',
        calories: 120,
        source: 'manual',
        createdAt: new Date('2023-10-27T18:00:00'),
      },
    ];
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
      submitButtonText: 'Add Workout',
    };
  }
}
