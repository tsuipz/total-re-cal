import {
  ChangeDetectionStrategy,
  Component,
  inject,
  OnInit,
  DestroyRef,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { BaseChartDirective } from 'ng2-charts';
import { ChartConfiguration, ChartType } from 'chart.js';
import { Store } from '@ngrx/store';
import { selectRolling7DayNetCalories } from '@app/core/stores/meals/meals.selectors';
import { Observable } from 'rxjs';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';

export interface NetCaloriesData {
  day: string;
  netCalories: number;
  goal: number;
}

@Component({
  selector: 'app-net-calories-line-chart',
  standalone: true,
  imports: [CommonModule, MatCardModule, MatIconModule, BaseChartDirective],
  templateUrl: './net-calories-line-chart.component.html',
  styleUrls: ['./net-calories-line-chart.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class NetCaloriesLineChartComponent implements OnInit {
  private store = inject(Store);
  private destroyRef = inject(DestroyRef);

  public netCalories$: Observable<NetCaloriesData[]> = this.store.select(
    selectRolling7DayNetCalories
  );

  public lineChartType: ChartType = 'line';
  public lineChartData: ChartConfiguration<'line'>['data'] = {
    datasets: [],
  };
  public lineChartOptions: ChartConfiguration<'line'>['options'] = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        display: false,
      },
    },
    scales: {
      x: {
        title: {
          display: true,
          text: 'Day',
        },
      },
      y: {
        title: {
          display: true,
          text: 'Net Calories',
        },
      },
    },
  };

  ngOnInit(): void {
    this.netCalories$
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe((data) => {
        this.updateChartData(data);
      });
  }

  /**
   * Update the chart data
   * @param data - The data to update the chart with
   */
  private updateChartData(data: NetCaloriesData[]): void {
    if (!data || data.length === 0) return;

    const labels = data.map((d) => d.day);
    const netCalories = data.map((d) => d.netCalories);
    const goal = data[0]?.goal || 1800;

    this.lineChartData = {
      labels,
      datasets: [
        {
          data: netCalories,
          label: 'Net Calories',
          borderColor: '#9c27b0',
          backgroundColor: 'rgba(156, 39, 176, 0.1)',
          tension: 0.4,
        },
        {
          data: Array(data.length).fill(goal),
          label: 'Goal',
          borderColor: '#bdbdbd',
          backgroundColor: 'rgba(189, 189, 189, 0.1)',
          borderDash: [5, 5],
          tension: 0,
          fill: false,
        },
      ],
    };

    // Update y-axis max
    const maxData = Math.max(...netCalories);
    const maxValue = Math.max(maxData, goal) + 200;

    // Create a new options object with proper type safety
    const currentScales = this.lineChartOptions?.scales || {};
    const currentYScale = currentScales['y'] || {};

    this.lineChartOptions = {
      ...this.lineChartOptions,
      scales: {
        ...currentScales,
        y: {
          ...currentYScale,
          max: maxValue,
        },
      },
    };
  }
}
