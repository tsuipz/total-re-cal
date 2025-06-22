import { Injectable, inject } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { catchError, switchMap, tap } from 'rxjs/operators';
import { of } from 'rxjs';
import * as MealsActions from './meals.actions';

@Injectable()
export class MealsEffects {
  private actions$ = inject(Actions);

  addMeal$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(MealsActions.addMeal),
      tap(({ meal }) => {
        // eslint-disable-next-line no-console
        console.log('[Meals Effects] Adding meal:', meal);
      }),
      switchMap(({ meal }) =>
        of(MealsActions.addMealSuccess({ meal })).pipe(
          catchError((error) =>
            of(MealsActions.addMealFailure({ error: error.message }))
          )
        )
      )
    );
  });

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
}
