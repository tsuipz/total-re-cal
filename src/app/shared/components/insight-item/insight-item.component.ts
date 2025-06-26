import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';
import { MatChipsModule } from '@angular/material/chips';

export type WeeklyInsightType = 'positive' | 'warning' | 'info' | 'negative';
export interface InsightItem {
  type: WeeklyInsightType;
  icon: string;
  title: string;
  description: string;
  metric: string;
}

@Component({
  selector: 'app-insight-item',
  standalone: true,
  imports: [CommonModule, MatIconModule, MatChipsModule],
  templateUrl: './insight-item.component.html',
  styleUrls: ['./insight-item.component.scss'],
})
export class InsightItemComponent {
  @Input({ required: true }) insight: InsightItem = {
    type: 'positive',
    icon: 'check_circle',
    title: 'Positive',
    description: 'This is a positive insight',
    metric: '100',
  };

  /**
   * Get the color for a given insight type
   * @param type - The type of insight
   * @returns The color for the insight type
   */
  public getInsightColor(type: WeeklyInsightType): string {
    switch (type) {
      case 'positive':
        return '#4caf50';
      case 'warning':
        return '#ff9800';
      case 'negative':
        return '#f44336';
      case 'info':
        return '#2196f3';
      default:
        return '#757575';
    }
  }
}
