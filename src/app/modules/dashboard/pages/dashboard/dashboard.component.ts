import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';

import { WeeklySummaryTableComponent } from '../../components/weekly-summary-table/weekly-summary-table.component';
import { NetCaloriesLineChartComponent } from '../../components/net-calories-line-chart/net-calories-line-chart.component';
import { DailyBreakdownBarChartComponent } from '../../components/daily-breakdown-bar-chart/daily-breakdown-bar-chart.component';
import { WeeklyInsightsComponent } from '../../components/weekly-insights/weekly-insights.component';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [
    CommonModule,
    MatCardModule,
    MatIconModule,
    WeeklySummaryTableComponent,
    NetCaloriesLineChartComponent,
    DailyBreakdownBarChartComponent,
    WeeklyInsightsComponent,
  ],
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss'],
})
export class DashboardPageComponent {}
