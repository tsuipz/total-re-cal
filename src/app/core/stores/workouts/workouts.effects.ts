import { Injectable, inject } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { catchError, switchMap, tap } from 'rxjs/operators';
import { of } from 'rxjs';
import * as WorkoutsActions from './workouts.actions';

@Injectable()
export class WorkoutsEffects {
  private actions$ = inject(Actions);

  addWorkout$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(WorkoutsActions.addWorkout),
      tap(({ workout }) => {
        // eslint-disable-next-line no-console
        console.log('[Workouts Effects] Adding workout:', workout);
      }),
      switchMap(({ workout }) =>
        of(WorkoutsActions.addWorkoutSuccess({ workout })).pipe(
          catchError((error) =>
            of(WorkoutsActions.addWorkoutFailure({ error: error.message }))
          )
        )
      )
    );
  });

  setWorkouts$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(WorkoutsActions.setWorkouts),
      tap(({ workouts }) => {
        // eslint-disable-next-line no-console
        console.log('[Workouts Effects] Setting workouts:', workouts);
      }),
      switchMap(({ workouts }) =>
        of(WorkoutsActions.setWorkoutsSuccess({ workouts })).pipe(
          catchError((error) =>
            of(WorkoutsActions.setWorkoutsFailure({ error: error.message }))
          )
        )
      )
    );
  });

  clearWorkouts$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(WorkoutsActions.clearWorkouts),
      tap(() => {
        // eslint-disable-next-line no-console
        console.log('[Workouts Effects] Clearing workouts');
      }),
      switchMap(() =>
        of(WorkoutsActions.clearWorkoutsSuccess()).pipe(
          catchError((error) =>
            of(WorkoutsActions.clearWorkoutsFailure({ error: error.message }))
          )
        )
      )
    );
  });
}
