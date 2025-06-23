import {
  ChangeDetectionStrategy,
  Component,
  inject,
  OnInit,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';

import { WeeklySummaryCardsComponent } from '../../components/weekly-summary-cards/weekly-summary-cards.component';
import { NetCaloriesLineChartComponent } from '../../components/net-calories-line-chart/net-calories-line-chart.component';
import { DailyBreakdownBarChartComponent } from '../../components/daily-breakdown-bar-chart/daily-breakdown-bar-chart.component';
import { WeeklyInsightsComponent } from '../../components/weekly-insights/weekly-insights.component';
import { Store } from '@ngrx/store';
import { selectCurrentUserId } from '@app/core/stores/auth/auth.selectors';
import * as MealsActions from '@app/core/stores/meals/meals.actions';
import { filter, take } from 'rxjs';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [
    CommonModule,
    MatCardModule,
    MatIconModule,
    WeeklySummaryCardsComponent,
    NetCaloriesLineChartComponent,
    DailyBreakdownBarChartComponent,
    WeeklyInsightsComponent,
  ],
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DashboardPageComponent implements OnInit {
  private store = inject(Store);
  private currentUserId$ = this.store.select(selectCurrentUserId);

  ngOnInit(): void {
    this.currentUserId$
      .pipe(
        filter((userId) => !!userId),
        take(1)
      )
      .subscribe((userId) => {
        if (userId) {
          this.store.dispatch(MealsActions.loadWeeksData({ userId }));
        }
      });
  }
}
