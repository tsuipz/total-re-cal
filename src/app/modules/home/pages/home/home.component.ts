import { Component, OnInit, inject } from '@angular/core';
import { Store } from '@ngrx/store';
import { filter, take } from 'rxjs';
import { CalorieSummaryComponent } from '../../components/calorie-summary/calorie-summary.component';
import { MealsLoggedTableComponent } from '../../components/meals-logged-table/meals-logged-table.component';
import { WorkoutsLoggedTableComponent } from '../../components/workouts-logged-table/workouts-logged-table.component';
import * as MealsActions from '@app/core/stores/meals/meals.actions';
import { selectCurrentUserId } from '@app/core/stores/auth/auth.selectors';

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
export class HomeComponent implements OnInit {
  private store = inject(Store);
  private currentUserId$ = this.store.select(selectCurrentUserId);

  ngOnInit(): void {
    // Load meals and workouts for today when component initializes
    this.currentUserId$
      .pipe(
        filter((userId) => !!userId),
        take(1)
      )
      .subscribe((userId) => {
        if (userId) {
          // Load both meals and workouts for today
          this.store.dispatch(MealsActions.loadTodaysData({ userId }));
        }
      });
  }
}
