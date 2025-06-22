import { Component, OnInit } from '@angular/core';
import { WorkoutEntry } from '../../../../core/models/interfaces/workout.interface';
import { CommonModule } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import {
  LogEntry,
  LoggedTableComponent,
} from '@app/shared/components/logged-table/logged-table.component';

const MUI = [MatButtonModule, MatIconModule];

const COMPONENTS = [LoggedTableComponent];

@Component({
  selector: 'app-workouts-logged-table',
  templateUrl: './workouts-logged-table.component.html',
  styleUrls: ['./workouts-logged-table.component.scss'],
  standalone: true,
  imports: [CommonModule, ...MUI, ...COMPONENTS],
})
export class WorkoutsLoggedTableComponent implements OnInit {
  workouts: LogEntry[] = [];

  ngOnInit(): void {
    this.workouts = this.getMockWorkouts()
      .map((workout) => ({
        ...workout,
        calories: -workout.calories,
      }))
      .sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime());
  }

  private getMockWorkouts(): WorkoutEntry[] {
    return [
      {
        id: '1',
        userId: '1',
        category: 'Running',
        name: 'Morning Run',
        calories: 280,
        source: 'photo',
        createdAt: new Date('2023-10-27T07:00:00'),
      },
      {
        id: '2',
        userId: '1',
        category: 'Yoga',
        name: 'Yoga Session',
        calories: 120,
        source: 'manual',
        createdAt: new Date('2023-10-27T18:00:00'),
      },
    ];
  }
}
