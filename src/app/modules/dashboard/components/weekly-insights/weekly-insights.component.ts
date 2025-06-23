import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { MatChipsModule } from '@angular/material/chips';

@Component({
  selector: 'app-weekly-insights',
  standalone: true,
  imports: [CommonModule, MatCardModule, MatIconModule, MatChipsModule],
  templateUrl: './weekly-insights.component.html',
  styleUrls: ['./weekly-insights.component.scss'],
})
export class WeeklyInsightsComponent {
  insights = [
    {
      type: 'positive',
      icon: 'trending_up',
      title: 'Consistent Progress',
      description:
        "You've maintained your calorie goals for 4 out of 7 days this week.",
      metric: '57% success rate',
    },
    {
      type: 'warning',
      icon: 'warning',
      title: 'Weekend Overindulgence',
      description:
        'Saturday showed the highest calorie intake. Consider planning meals ahead.',
      metric: '+400 cal over goal',
    },
    {
      type: 'info',
      icon: 'lightbulb',
      title: 'Best Performance',
      description:
        'Thursday was your most balanced day with perfect goal alignment.',
      metric: '100% on target',
    },
    {
      type: 'positive',
      icon: 'fitness_center',
      title: 'Active Week',
      description: 'You exceeded your workout goals by 20% this week.',
      metric: '+2 workouts',
    },
  ];

  getInsightColor(type: string): string {
    switch (type) {
      case 'positive':
        return '#4caf50';
      case 'warning':
        return '#ff9800';
      case 'info':
        return '#2196f3';
      default:
        return '#757575';
    }
  }
}
