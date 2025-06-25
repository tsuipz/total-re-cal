import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { Store } from '@ngrx/store';
import { Observable } from 'rxjs';
import { selectWeeklyIntakeBurnedBarChart } from '@app/core/stores/meals/meals.selectors';

export interface DailyBreakdownBarChartData {
  day: string;
  intake: number;
  burned: number;
  net: number;
}

@Component({
  selector: 'app-daily-breakdown-bar-chart',
  standalone: true,
  imports: [CommonModule, MatCardModule, MatIconModule],
  templateUrl: './daily-breakdown-bar-chart.component.html',
  styleUrls: ['./daily-breakdown-bar-chart.component.scss'],
})
export class DailyBreakdownBarChartComponent {
  private store = inject(Store);

  public weeklyData$: Observable<DailyBreakdownBarChartData[]> =
    this.store.select(selectWeeklyIntakeBurnedBarChart);
}
