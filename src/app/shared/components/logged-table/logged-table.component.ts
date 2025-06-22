import { ChangeDetectionStrategy, Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';

export interface LogEntry {
  name: string;
  category: string;
  calories: number;
  source: string;
  createdAt: Date;
}

const MUI = [MatCardModule];

@Component({
  selector: 'app-logged-table',
  imports: [CommonModule, ...MUI],
  templateUrl: './logged-table.component.html',
  styleUrl: './logged-table.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class LoggedTableComponent {
  @Input() items: LogEntry[] = [];
  @Input() emptyMessage = 'No items logged yet';
}
