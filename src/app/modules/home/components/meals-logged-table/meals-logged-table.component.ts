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
  selectTodaysMeals,
  selectMealsIsLoading,
} from '@app/core/stores/meals/meals.selectors';
import { selectCurrentUserId } from '@app/core/stores/auth/auth.selectors';
import * as MealsActions from '@app/core/stores/meals/meals.actions';
import { MealEntry } from '@app/core/models/interfaces';

const MUI = [MatButtonModule, MatIconModule, MatDialogModule];

const COMPONENTS = [LoggedTableComponent];

@Component({
  selector: 'app-meals-logged-table',
  templateUrl: './meals-logged-table.component.html',
  styleUrls: ['./meals-logged-table.component.scss'],
  standalone: true,
  imports: [CommonModule, ...MUI, ...COMPONENTS],
})
export class MealsLoggedTableComponent {
  private dialog = inject(MatDialog);
  private store = inject(Store);

  meals$ = this.store
    .select(selectTodaysMeals)
    .pipe(map((meals) => meals?.map(this.mapMealToLogEntry) || []));
  isLoading$ = this.store.select(selectMealsIsLoading);
  currentUserId$ = this.store.select(selectCurrentUserId);

  openAddMealDialog(): void {
    const dialogRef = this.dialog.open(AddEntryDialogComponent, {
      width: '500px',
      disableClose: false,
      data: this.getMealDialogConfig(),
    });

    // After the dialog is closed, we need to add the meal to the store
    dialogRef
      .afterClosed()
      .pipe(
        take(1),
        filter((result) => !!result)
      )
      .subscribe((result) => {
        // if there is no result, don't add the meal to the store
        if (result) {
          const formValue: AddEntryFormValue = result;
          this.currentUserId$.pipe(take(1)).subscribe((userId) => {
            if (userId) {
              // Create meal data
              const mealData: MealEntry = {
                id: '',
                userId,
                createdAt: formValue.datetime ?? new Date(),
                name: formValue.name,
                category: formValue.category,
                calories: formValue.calories,
                source: 'manual',
              };

              this.store.dispatch(MealsActions.addMeal({ meal: mealData }));
            }
          });
        }
      });
  }

  private mapMealToLogEntry(meal: MealEntry): LogEntry {
    return {
      name: meal.name,
      category: meal.category,
      calories: meal.calories,
      source: meal.source,
      createdAt: meal.createdAt,
    };
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
