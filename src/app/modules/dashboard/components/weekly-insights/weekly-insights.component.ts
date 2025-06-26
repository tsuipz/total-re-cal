import { Component, OnInit, OnDestroy, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { MatChipsModule } from '@angular/material/chips';
import { Store } from '@ngrx/store';
import { DailyCaloriesData } from '@app/shared/utils/calories.util';
import { selectWeeklyDataForInsights } from '@app/core/stores/meals/meals.selectors';
import { selectCurrentUserDailyCaloriesGoal } from '@app/core/stores/auth/auth.selectors';
import { Subject, takeUntil } from 'rxjs';
import {
  InsightItemComponent,
  InsightsSummaryComponent,
} from '@app/shared/components';
import { InsightItem } from '@app/shared/components/insight-item/insight-item.component';
import { InsightsSummaryData } from '@app/shared/components/insights-summary/insights-summary.component';

export interface SummaryData {
  daysOnTarget: number;
  bestDay: string;
  worstDay: string;
  consistencyScore: number;
  overallMessage: string;
}

export interface WeeklyInsightsData {
  daysOnTarget: number;
  bestDay: string;
  worstDay: string;
  consistencyScore: number;
  overallMessage: string;
  insights: InsightItem[];
}

@Component({
  selector: 'app-weekly-insights',
  standalone: true,
  imports: [
    CommonModule,
    MatCardModule,
    MatIconModule,
    MatChipsModule,
    InsightItemComponent,
    InsightsSummaryComponent,
  ],
  templateUrl: './weekly-insights.component.html',
  styleUrls: ['./weekly-insights.component.scss'],
})
export class WeeklyInsightsComponent implements OnInit, OnDestroy {
  private store = inject(Store);
  private destroy$ = new Subject<void>();

  // Observable properties
  public weeklyData$ = this.store.select(selectWeeklyDataForInsights);
  public calorieTarget$ = this.store.select(selectCurrentUserDailyCaloriesGoal);

  // Component state
  public weeklyData: DailyCaloriesData[] = [];
  public calorieTarget = 2000; // Default target
  public toleranceRange = 100; // ±100 calories tolerance

  public insights: InsightItem[] = [];
  public summaryData: SummaryData = {
    daysOnTarget: 0,
    bestDay: '',
    worstDay: '',
    consistencyScore: 0,
    overallMessage: '',
  };

  ngOnInit(): void {
    // Subscribe to the observables
    this.weeklyData$.pipe(takeUntil(this.destroy$)).subscribe((data) => {
      this.weeklyData = data || [];
      this.calculateInsights();
    });

    this.calorieTarget$.pipe(takeUntil(this.destroy$)).subscribe((target) => {
      this.calorieTarget = target || 2000;
      this.calculateInsights();
    });
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  /**
   * Get the summary data for the insights summary component
   */
  public getSummaryData(): InsightsSummaryData {
    return {
      daysOnTarget: this.summaryData.daysOnTarget,
      consistencyScore: this.summaryData.consistencyScore,
    };
  }

  private calculateInsights(): void {
    if (!this.weeklyData || this.weeklyData.length === 0) {
      this.setDefaultInsights();
      return;
    }

    const analysis = this.analyzeWeeklyData();
    this.summaryData = analysis.summary;
    this.insights = analysis.insights;
  }

  private analyzeWeeklyData(): {
    summary: SummaryData;
    insights: InsightItem[];
  } {
    const daysOnTarget = this.calculateDaysOnTarget();
    const bestDay = this.findBestDay();
    const worstDay = this.findWorstDay();
    const consistencyScore = Math.round((daysOnTarget / 7) * 100);
    const overallMessage = this.generateOverallMessage(daysOnTarget);

    const insights: InsightItem[] = [];

    // Days on target insight
    insights.push({
      type:
        daysOnTarget >= 4
          ? 'positive'
          : daysOnTarget >= 2
          ? 'warning'
          : 'negative',
      icon: 'flag',
      title: 'Goal Achievement',
      description: `You hit your calorie goal ${daysOnTarget} out of 7 days this week.`,
      metric: `${daysOnTarget}/7 days on target`,
    });

    // Best day insight
    if (bestDay) {
      insights.push({
        type: 'positive',
        icon: 'star',
        title: 'Best Performance',
        description: `${bestDay} was your most balanced day with excellent goal alignment.`,
        metric: 'Perfect balance',
      });
    }

    // Worst day insight
    if (worstDay) {
      const worstDayData = this.weeklyData.find((d) => d.day === worstDay);
      const deviation = worstDayData
        ? Math.abs(
            worstDayData.intake - worstDayData.burned - this.calorieTarget
          )
        : 0;

      insights.push({
        type: deviation > 300 ? 'warning' : 'info',
        icon: 'trending_down',
        title: 'Room for Improvement',
        description: `${worstDay} had the biggest deviation from your goal.`,
        metric: `${deviation} cal off target`,
      });
    }

    // Consistency insight
    insights.push({
      type:
        consistencyScore >= 70
          ? 'positive'
          : consistencyScore >= 50
          ? 'warning'
          : 'negative',
      icon: 'timeline',
      title: 'Weekly Consistency',
      description: `Your consistency score shows how well you maintained your goals.`,
      metric: `${consistencyScore}% consistent`,
    });

    // Active week insight
    const totalBurned = this.weeklyData.reduce(
      (sum, day) => sum + day.burned,
      0
    );
    const avgBurned = totalBurned / 7;

    if (avgBurned > 300) {
      insights.push({
        type: 'positive',
        icon: 'fitness_center',
        title: 'Active Week',
        description: `You averaged ${Math.round(
          avgBurned
        )} calories burned per day.`,
        metric: `${Math.round(totalBurned)} cal total`,
      });
    }

    return {
      summary: {
        daysOnTarget,
        bestDay,
        worstDay,
        consistencyScore,
        overallMessage,
      },
      insights,
    };
  }

  private calculateDaysOnTarget(): number {
    return this.weeklyData.filter((day) => {
      const netCalories = day.intake - day.burned;
      const deviation = Math.abs(netCalories - this.calorieTarget);
      return deviation <= this.toleranceRange;
    }).length;
  }

  private findBestDay(): string {
    if (this.weeklyData.length === 0) return '';

    let bestDay = this.weeklyData[0];
    let bestScore = Infinity;

    this.weeklyData.forEach((day) => {
      const netCalories = day.intake - day.burned;
      const deviation = Math.abs(netCalories - this.calorieTarget);

      if (deviation < bestScore) {
        bestScore = deviation;
        bestDay = day;
      }
    });

    return bestDay.day;
  }

  private findWorstDay(): string {
    if (this.weeklyData.length === 0) return '';

    let worstDay = this.weeklyData[0];
    let worstScore = 0;

    this.weeklyData.forEach((day) => {
      const netCalories = day.intake - day.burned;
      const deviation = Math.abs(netCalories - this.calorieTarget);

      if (deviation > worstScore) {
        worstScore = deviation;
        worstDay = day;
      }
    });

    return worstDay.day;
  }

  private generateOverallMessage(daysOnTarget: number): string {
    if (daysOnTarget >= 6) {
      return 'Outstanding! You crushed your goals this week! 🎯';
    } else if (daysOnTarget >= 4) {
      return "Great job! You're making solid progress toward your goals! 💪";
    } else if (daysOnTarget >= 2) {
      return "Keep going! You're building good habits. 🔥";
    } else {
      return "Don't worry! Every week is a fresh start to improve. 🌟";
    }
  }

  private setDefaultInsights(): void {
    this.summaryData = {
      daysOnTarget: 0,
      bestDay: '',
      worstDay: '',
      consistencyScore: 0,
      overallMessage: 'No data available for this week.',
    };

    this.insights = [
      {
        type: 'info',
        icon: 'info',
        title: 'No Data Available',
        description: 'Start logging your meals and workouts to see insights.',
        metric: 'Add entries',
      },
    ];
  }
}
