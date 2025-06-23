import { CommonModule, DecimalPipe, NgStyle } from '@angular/common';
import { Component, inject } from '@angular/core';
import { AuthSelectors } from '@app/core/stores/auth';
import { MealsSelectors } from '@app/core/stores/meals';
import { WorkoutsSelectors } from '@app/core/stores/workouts';
import { Store } from '@ngrx/store';

@Component({
  selector: 'app-calorie-summary',
  templateUrl: './calorie-summary.component.html',
  styleUrls: ['./calorie-summary.component.scss'],
  standalone: true,
  imports: [NgStyle, DecimalPipe, CommonModule],
})
export class CalorieSummaryComponent {
  private store = inject(Store);

  public consumed$ = this.store.select(
    MealsSelectors.selectTodaysTotalCalories
  );
  public burned$ = this.store.select(
    WorkoutsSelectors.selectTodaysTotalCalories
  );
  public net$ = this.store.select(MealsSelectors.selectTodaysNetCalories);
  public target$ = this.store.select(
    AuthSelectors.selectCurrentUserDailyCaloriesGoal
  );
  public remaining$ = this.store.select(MealsSelectors.selectRemainingCalories);
  public progress$ = this.store.select(
    MealsSelectors.selectTodaysTotalCaloriesProgress
  );
}
