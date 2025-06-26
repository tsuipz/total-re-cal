import { Injectable, inject } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { catchError, switchMap, tap, mergeMap } from 'rxjs/operators';
import { mapResponse } from '@ngrx/operators';
import { of } from 'rxjs';
import { MatSnackBar } from '@angular/material/snack-bar';
import * as MealsActions from './meals.actions';
import * as WorkoutsActions from '../workouts/workouts.actions';
import { MealsService } from '../../services/meals.service';
import { HttpErrorResponse } from '@angular/common/http';
import { WeightsActions } from '../weights';

@Injectable()
export class MealsEffects {
  private actions$ = inject(Actions);
  private mealsService = inject(MealsService);
  private snackBar = inject(MatSnackBar);

  addMeal$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(MealsActions.addMeal),
      switchMap(({ meal }) =>
        this.mealsService.createMeal(meal).pipe(
          mapResponse({
            next: (createdMeal) =>
              MealsActions.addMealSuccess({ meal: createdMeal }),
            error: (error: HttpErrorResponse) =>
              MealsActions.addMealFailure({ error }),
          })
        )
      )
    );
  });

  addMealSuccess$ = createEffect(
    () => {
      return this.actions$.pipe(
        ofType(MealsActions.addMealSuccess),
        tap(({ meal }) => {
          this.snackBar.open(
            `Meal "${meal.name}" added successfully!`,
            'Close',
            {
              duration: 3000,
              horizontalPosition: 'end',
              verticalPosition: 'top',
            }
          );
        })
      );
    },
    { dispatch: false }
  );

  addMealFailure$ = createEffect(
    () => {
      return this.actions$.pipe(
        ofType(MealsActions.addMealFailure),
        tap(({ error }) => {
          this.snackBar.open(
            `Failed to add meal: ${error.error || 'Unknown error'}`,
            'Close',
            {
              duration: 5000,
              horizontalPosition: 'end',
              verticalPosition: 'top',
              panelClass: ['error-snackbar'],
            }
          );
        })
      );
    },
    { dispatch: false }
  );

  setMeals$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(MealsActions.setMeals),
      tap(({ meals }) => {
        // eslint-disable-next-line no-console
        console.log('[Meals Effects] Setting meals:', meals);
      }),
      switchMap(({ meals }) =>
        of(MealsActions.setMealsSuccess({ meals })).pipe(
          catchError((error) =>
            of(MealsActions.setMealsFailure({ error: error.message }))
          )
        )
      )
    );
  });

  clearMeals$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(MealsActions.clearMeals),
      tap(() => {
        // eslint-disable-next-line no-console
        console.log('[Meals Effects] Clearing meals');
      }),
      switchMap(() =>
        of(MealsActions.clearMealsSuccess()).pipe(
          catchError((error) =>
            of(MealsActions.clearMealsFailure({ error: error.message }))
          )
        )
      )
    );
  });

  loadMealsForToday$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(MealsActions.loadMealsForToday),
      switchMap(({ userId }) =>
        this.mealsService.getMealsForToday(userId).pipe(
          mapResponse({
            next: (meals) => MealsActions.loadMealsForTodaySuccess({ meals }),
            error: (error: HttpErrorResponse) =>
              MealsActions.loadMealsForTodayFailure({ error }),
          })
        )
      )
    );
  });

  loadTodaysData$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(MealsActions.loadTodaysData),
      mergeMap(({ userId }) =>
        of(
          MealsActions.loadMealsForToday({ userId }),
          WorkoutsActions.loadWorkoutsForToday({ userId }),
          WeightsActions.loadWeightHistory({ userId })
        )
      )
    );
  });

  loadMealsForWeek$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(MealsActions.loadMealsForWeek),
      switchMap(({ userId }) =>
        this.mealsService.getMealsForLast7Days(userId).pipe(
          mapResponse({
            next: (meals) => MealsActions.loadMealsForWeekSuccess({ meals }),
            error: (error: HttpErrorResponse) =>
              MealsActions.loadMealsForWeekFailure({ error }),
          })
        )
      )
    );
  });

  loadWeeksData$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(MealsActions.loadWeeksData),
      mergeMap(({ userId }) =>
        of(
          MealsActions.loadMealsForWeek({ userId }),
          WorkoutsActions.loadWorkoutsForWeek({ userId })
        )
      )
    );
  });
}
