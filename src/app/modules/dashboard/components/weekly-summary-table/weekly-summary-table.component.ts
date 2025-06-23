import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatTableModule } from '@angular/material/table';
import { MatIconModule } from '@angular/material/icon';

@Component({
  selector: 'app-weekly-summary-table',
  standalone: true,
  imports: [CommonModule, MatCardModule, MatTableModule, MatIconModule],
  templateUrl: './weekly-summary-table.component.html',
  styleUrls: ['./weekly-summary-table.component.scss'],
})
export class WeeklySummaryTableComponent {
  displayedColumns: string[] = [
    'day',
    'caloriesIn',
    'caloriesOut',
    'netCalories',
    'goal',
  ];
  weeklyData = [
    {
      day: 'Monday',
      caloriesIn: 2100,
      caloriesOut: 500,
      netCalories: 1600,
      goal: 1800,
    },
    {
      day: 'Tuesday',
      caloriesIn: 1950,
      caloriesOut: 600,
      netCalories: 1350,
      goal: 1800,
    },
    {
      day: 'Wednesday',
      caloriesIn: 2200,
      caloriesOut: 450,
      netCalories: 1750,
      goal: 1800,
    },
    {
      day: 'Thursday',
      caloriesIn: 1800,
      caloriesOut: 700,
      netCalories: 1100,
      goal: 1800,
    },
    {
      day: 'Friday',
      caloriesIn: 2300,
      caloriesOut: 400,
      netCalories: 1900,
      goal: 1800,
    },
    {
      day: 'Saturday',
      caloriesIn: 2500,
      caloriesOut: 300,
      netCalories: 2200,
      goal: 1800,
    },
    {
      day: 'Sunday',
      caloriesIn: 2000,
      caloriesOut: 550,
      netCalories: 1450,
      goal: 1800,
    },
  ];
}
