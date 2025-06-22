import { Component } from '@angular/core';
import { CalorieSummaryComponent } from '../../components/calorie-summary/calorie-summary.component';
import { MealsLoggedTableComponent } from '../../components/meals-logged-table/meals-logged-table.component';
import { WorkoutsLoggedTableComponent } from '../../components/workouts-logged-table/workouts-logged-table.component';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrl: './home.component.scss',
  standalone: true,
  imports: [
    CalorieSummaryComponent,
    MealsLoggedTableComponent,
    WorkoutsLoggedTableComponent,
  ],
})
export class HomeComponent {}
