import {
  ChangeDetectionStrategy,
  Component,
  Input,
  Output,
  EventEmitter,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';

export interface LogEntry {
  name: string;
  category: string;
  calories: number;
  source: string;
  createdAt: Date;
}

const MUI = [MatCardModule, MatButtonModule, MatIconModule];

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
  @Input() emptyIcon = 'add_circle_outline';
  @Input() emptyActionText = 'Add your first item';
  @Input() showEmptyAction = false;
  @Output() emptyActionClick = new EventEmitter<void>();
}
