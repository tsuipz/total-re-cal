import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';

@Component({
  selector: 'app-net-calories-line-chart',
  standalone: true,
  imports: [CommonModule, MatCardModule, MatIconModule],
  templateUrl: './net-calories-line-chart.component.html',
  styleUrls: ['./net-calories-line-chart.component.scss'],
})
export class NetCaloriesLineChartComponent {
  chartData = [
    { day: 'Mon', netCalories: 1600, goal: 1800 },
    { day: 'Tue', netCalories: 1350, goal: 1800 },
    { day: 'Wed', netCalories: 1750, goal: 1800 },
    { day: 'Thu', netCalories: 1100, goal: 1800 },
    { day: 'Fri', netCalories: 1900, goal: 1800 },
    { day: 'Sat', netCalories: 2200, goal: 1800 },
    { day: 'Sun', netCalories: 1450, goal: 1800 },
  ];

  getAverageNetCalories(): number {
    const total = this.chartData.reduce(
      (sum, item) => sum + item.netCalories,
      0
    );
    return Math.round(total / this.chartData.length);
  }

  getGoalAchievementRate(): number {
    const daysOnTarget = this.chartData.filter(
      (item) => Math.abs(item.netCalories - item.goal) <= 100
    ).length;
    return Math.round((daysOnTarget / this.chartData.length) * 100);
  }
}
