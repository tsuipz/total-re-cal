import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';

export interface InsightsSummaryData {
  daysOnTarget: number;
  consistencyScore: number;
}

type OverallGrade = 'A' | 'B' | 'C' | 'D' | 'F';

type TrendIcon = '↗' | '→' | '↘';

type TrendText = 'Improving' | 'Stable' | 'Needs Work';

@Component({
  selector: 'app-insights-summary',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './insights-summary.component.html',
  styleUrls: ['./insights-summary.component.scss'],
})
export class InsightsSummaryComponent {
  @Input({ required: true }) summaryData!: InsightsSummaryData;

  /**
   * Get the overall grade for the consistency score
   * @returns The overall grade
   */

  public getOverallGrade(): OverallGrade {
    const score = this.summaryData.consistencyScore;
    if (score >= 85) return 'A';
    if (score >= 70) return 'B';
    if (score >= 50) return 'C';
    if (score >= 30) return 'D';
    return 'F';
  }

  /**
   * Get the trend icon for the consistency score
   * @returns The trend icon
   */
  public getTrendIcon(): TrendIcon {
    const score = this.summaryData.consistencyScore;
    if (score >= 70) return '↗';
    if (score >= 50) return '→';
    return '↘';
  }

  /**
   * Get the trend text for the consistency score
   * @returns The trend text
   */
  public getTrendText(): TrendText {
    const score = this.summaryData.consistencyScore;
    if (score >= 70) return 'Improving';
    if (score >= 50) return 'Stable';
    return 'Needs Work';
  }
}
