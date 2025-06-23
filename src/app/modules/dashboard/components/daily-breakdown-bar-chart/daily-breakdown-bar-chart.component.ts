import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';

@Component({
  selector: 'app-daily-breakdown-bar-chart',
  standalone: true,
  imports: [CommonModule, MatCardModule, MatIconModule],
  templateUrl: './daily-breakdown-bar-chart.component.html',
  styleUrls: ['./daily-breakdown-bar-chart.component.scss'],
})
export class DailyBreakdownBarChartComponent {
  breakdownData = [
    { category: 'Breakfast', calories: 450, percentage: 22 },
    { category: 'Lunch', calories: 650, percentage: 32 },
    { category: 'Dinner', calories: 700, percentage: 34 },
    { category: 'Snacks', calories: 250, percentage: 12 },
  ];

  getTotalCalories(): number {
    return this.breakdownData.reduce((sum, item) => sum + item.calories, 0);
  }

  getLargestCategory(): string {
    return this.breakdownData.reduce((max, item) =>
      item.calories > max.calories ? item : max
    ).category;
  }
}
