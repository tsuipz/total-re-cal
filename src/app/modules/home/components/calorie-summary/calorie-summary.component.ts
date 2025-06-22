import { CommonModule, DecimalPipe, NgStyle } from '@angular/common';
import { Component } from '@angular/core';

@Component({
  selector: 'app-calorie-summary',
  templateUrl: './calorie-summary.component.html',
  styleUrls: ['./calorie-summary.component.scss'],
  standalone: true,
  imports: [NgStyle, DecimalPipe, CommonModule],
})
export class CalorieSummaryComponent {
  consumed = 950;
  burned = 400;
  target = 1650;

  get net(): number {
    return this.consumed - this.burned;
  }

  get remaining(): number {
    return this.target - this.net;
  }

  get progress(): number {
    return (this.net / this.target) * 100;
  }
}
