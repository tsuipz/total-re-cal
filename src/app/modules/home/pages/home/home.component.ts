import { Component } from '@angular/core';
import { CalorieSummaryComponent } from '../../components/calorie-summary/calorie-summary.component';
import { MealsLoggedTableComponent } from '../../components/meals-logged-table/meals-logged-table.component';
import { WorkoutsLoggedComponent } from '../../components/workouts-logged/workouts-logged.component';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrl: './home.component.scss',
  standalone: true,
  imports: [
    CalorieSummaryComponent,
    MealsLoggedTableComponent,
    WorkoutsLoggedComponent,
  ],
})
export class HomeComponent {}
