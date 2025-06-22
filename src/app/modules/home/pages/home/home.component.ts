import { Component } from '@angular/core';
import { CalorieSummaryComponent } from '../../components/calorie-summary/calorie-summary.component';
import { MealsLoggedComponent } from '../../components/meals-logged/meals-logged.component';
import { WorkoutsLoggedComponent } from '../../components/workouts-logged/workouts-logged.component';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrl: './home.component.scss',
  standalone: true,
  imports: [
    CalorieSummaryComponent,
    MealsLoggedComponent,
    WorkoutsLoggedComponent,
  ],
})
export class HomeComponent {}
