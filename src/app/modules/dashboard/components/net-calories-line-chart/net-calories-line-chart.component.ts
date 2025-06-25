import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { NgxChartsModule } from '@swimlane/ngx-charts';
import { Store } from '@ngrx/store';
import { selectRolling7DayNetCalories } from '@app/core/stores/meals/meals.selectors';
import { Observable } from 'rxjs';

export interface NetCaloriesData {
  day: string;
  netCalories: number;
  goal: number;
}

@Component({
  selector: 'app-net-calories-line-chart',
  standalone: true,
  imports: [CommonModule, MatCardModule, MatIconModule, NgxChartsModule],
  templateUrl: './net-calories-line-chart.component.html',
  styleUrls: ['./net-calories-line-chart.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class NetCaloriesLineChartComponent {
  private store = inject(Store);
  public netCalories$: Observable<NetCaloriesData[]> = this.store.select(
    selectRolling7DayNetCalories
  );

  // ngx-charts expects [{ name: string, series: [{ name: string, value: number }] }]
  public toChartSeries(
    data: { day: string; netCalories: number; goal: number }[]
  ) {
    return [
      {
        name: 'Net Calories',
        series: data.map((d) => ({ name: d.day, value: d.netCalories })),
      },
    ];
  }

  // For reference line
  public getGoalLine(data: { goal: number }[]): number {
    return data.length ? data[0].goal : 1800;
  }

  public getYScaleMax(data: { netCalories: number; goal: number }[]): number {
    if (!data.length) return 2000;
    const maxData = Math.max(...data.map((d) => d.netCalories));
    const goal = data[0]?.goal ?? 1800;
    return Math.max(maxData, goal) + 200;
  }
}
