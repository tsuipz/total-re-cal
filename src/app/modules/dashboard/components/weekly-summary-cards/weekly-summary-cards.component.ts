import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { Store } from '@ngrx/store';
import { MealsSelectors } from '@app/core/stores/meals';
import { WorkoutsSelectors } from '@app/core/stores/workouts';

@Component({
  selector: 'app-weekly-summary-cards',
  standalone: true,
  imports: [CommonModule, MatCardModule, MatIconModule],
  templateUrl: './weekly-summary-cards.component.html',
  styleUrls: ['./weekly-summary-cards.component.scss'],
})
export class WeeklySummaryCardsComponent {
  private store = inject(Store);

  public averageDailyIntake$ = this.store.select(
    MealsSelectors.selectAverageDailyIntake
  );
  public averageDailyBurn$ = this.store.select(
    WorkoutsSelectors.selectAverageDailyBurn
  );
  public daysOnTarget$ = this.store.select(MealsSelectors.selectDaysOnTarget);
  public totalBurnedInWeek$ = this.store.select(
    WorkoutsSelectors.selectTotalBurnedInWeek
  );
}
