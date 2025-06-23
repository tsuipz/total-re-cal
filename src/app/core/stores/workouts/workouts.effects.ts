import { Injectable, inject } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { catchError, switchMap, tap } from 'rxjs/operators';
import { mapResponse } from '@ngrx/operators';
import { of } from 'rxjs';
import { MatSnackBar } from '@angular/material/snack-bar';
import * as WorkoutsActions from './workouts.actions';
import { WorkoutsService } from '../../services/workouts.service';
import { HttpErrorResponse } from '@angular/common/http';

@Injectable()
export class WorkoutsEffects {
  private actions$ = inject(Actions);
  private workoutsService = inject(WorkoutsService);
  private snackBar = inject(MatSnackBar);

  addWorkout$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(WorkoutsActions.addWorkout),
      switchMap(({ workout }) =>
        this.workoutsService.createWorkout(workout).pipe(
          mapResponse({
            next: (createdWorkout) =>
              WorkoutsActions.addWorkoutSuccess({ workout: createdWorkout }),
            error: (error: HttpErrorResponse) =>
              WorkoutsActions.addWorkoutFailure({ error }),
          })
        )
      )
    );
  });

  addWorkoutSuccess$ = createEffect(
    () => {
      return this.actions$.pipe(
        ofType(WorkoutsActions.addWorkoutSuccess),
        tap(({ workout }) => {
          this.snackBar.open(
            `Workout "${workout.name}" added successfully!`,
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

  addWorkoutFailure$ = createEffect(
    () => {
      return this.actions$.pipe(
        ofType(WorkoutsActions.addWorkoutFailure),
        tap(({ error }) => {
          this.snackBar.open(
            `Failed to add workout: ${error.error || 'Unknown error'}`,
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

  loadWorkoutsForToday$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(WorkoutsActions.loadWorkoutsForToday),
      tap(({ userId }) => {
        // eslint-disable-next-line no-console
        console.log(
          '[Workouts Effects] Loading workouts for today for user:',
          userId
        );
      }),
      switchMap(({ userId }) =>
        this.workoutsService.getWorkoutsForToday(userId).pipe(
          mapResponse({
            next: (workouts) =>
              WorkoutsActions.loadWorkoutsForTodaySuccess({ workouts }),
            error: (error: HttpErrorResponse) =>
              WorkoutsActions.loadWorkoutsForTodayFailure({ error }),
          })
        )
      )
    );
  });
}
