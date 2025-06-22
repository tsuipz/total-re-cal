import { Component, OnInit } from '@angular/core';
import { MealEntry } from '../../../../core/models/interfaces/meal.interface';
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
  selector: 'app-meals-logged-table',
  templateUrl: './meals-logged-table.component.html',
  styleUrls: ['./meals-logged-table.component.scss'],
  standalone: true,
  imports: [CommonModule, ...MUI, ...COMPONENTS],
})
export class MealsLoggedTableComponent implements OnInit {
  private dialog = inject(MatDialog);
  meals: LogEntry[] = [];

  ngOnInit(): void {
    this.meals = this.getMockMeals().sort(
      (a, b) => b.createdAt.getTime() - a.createdAt.getTime()
    );
  }

  openAddMealDialog(): void {
    const dialogRef = this.dialog.open(AddEntryDialogComponent, {
      width: '500px',
      disableClose: false,
      data: this.getMealDialogConfig(),
    });

    dialogRef
      .afterClosed()
      .pipe(take(1))
      .subscribe((result) => {
        if (result) {
          // TODO: Add the meal to the meals array and save to backend
          // For now, this is a placeholder for the actual implementation
        }
      });
  }

  private getMockMeals(): MealEntry[] {
    return [
      {
        id: '1',
        userId: '1',
        category: 'Breakfast',
        name: 'Avocado Toast with Eggs',
        calories: 420,
        source: 'photo',
        createdAt: new Date('2023-10-27T08:30:00'),
      },
      {
        id: '2',
        userId: '1',
        category: 'Lunch',
        name: 'Greek Salad with Chicken',
        calories: 380,
        source: 'manual',
        createdAt: new Date('2023-10-27T12:45:00'),
      },
      {
        id: '3',
        userId: '1',
        category: 'Snack',
        name: 'Apple & Almonds',
        calories: 150,
        source: 'manual',
        createdAt: new Date('2023-10-27T15:30:00'),
      },
    ];
  }

  private getMealDialogConfig(): AddEntryDialogData {
    return {
      title: 'Add Meal',
      icon: 'restaurant',
      nameLabel: 'Meal Name',
      namePlaceholder: 'e.g., Grilled Chicken Salad',
      categoryLabel: 'Category',
      categoryPlaceholder: 'e.g., Breakfast, Lunch, Snack',
      caloriesLabel: 'Calories',
      caloriesPlaceholder: 'e.g., 350',
      datetimeLabel: 'Date',
      timeLabel: 'Time',
      submitButtonText: 'Add Meal',
    };
  }
}
