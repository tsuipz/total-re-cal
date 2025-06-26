import { Injectable, inject } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { map, switchMap, tap } from 'rxjs/operators';
import { mapResponse } from '@ngrx/operators';
import { of } from 'rxjs';
import { MatSnackBar } from '@angular/material/snack-bar';
import * as WeightActions from './weight.actions';
import { WeightService } from '../../services/weight.service';
import { HttpErrorResponse } from '@angular/common/http';
import { AuthActions } from '../auth';

@Injectable()
export class WeightEffects {
  private actions$ = inject(Actions);
  private weightService = inject(WeightService);
  private snackBar = inject(MatSnackBar);

  /**
   * Add weight check-in effect
   */
  addWeightCheckIn$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(WeightActions.addWeightCheckIn),
      switchMap(({ weight }) =>
        this.weightService.saveWeightCheckIn(weight).pipe(
          mapResponse({
            next: (weightCheckIn) =>
              WeightActions.addWeightCheckInSuccess({ weightCheckIn }),
            error: (error: HttpErrorResponse) =>
              WeightActions.addWeightCheckInFailure({ error }),
          })
        )
      )
    );
  });

  /**
   * Add weight check-in success effect - Show success message
   */
  addWeightCheckInSuccess$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(WeightActions.addWeightCheckInSuccess),
      tap(({ weightCheckIn }) => {
        this.snackBar.open(
          `Weight check-in saved: ${weightCheckIn.weight} lbs`,
          'Close',
          {
            duration: 3000,
            horizontalPosition: 'end',
            verticalPosition: 'top',
          }
        );
      }),
      map(({ weightCheckIn }) =>
        AuthActions.saveUserProfileWeight({
          weight: weightCheckIn.weight,
        })
      )
    );
  });

  /**
   * Load weight history effect
   */
  loadWeightHistory$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(WeightActions.loadWeightHistory),
      switchMap(({ userId }) =>
        this.weightService.getWeightHistory(userId).pipe(
          mapResponse({
            next: (weightCheckIns) =>
              WeightActions.loadWeightHistorySuccess({ weightCheckIns }),
            error: (error: HttpErrorResponse) =>
              WeightActions.loadWeightHistoryFailure({ error }),
          })
        )
      )
    );
  });

  /**
   * Load latest weight check-in effect
   */
  loadLatestWeightCheckIn$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(WeightActions.loadLatestWeightCheckIn),
      switchMap(({ userId }) =>
        this.weightService.getLatestWeightCheckIn(userId).pipe(
          mapResponse({
            next: (weightCheckIn) =>
              WeightActions.loadLatestWeightCheckInSuccess({ weightCheckIn }),
            error: (error: HttpErrorResponse) =>
              WeightActions.loadLatestWeightCheckInFailure({ error }),
          })
        )
      )
    );
  });

  /**
   * Load weight check-ins by date range effect
   */
  loadWeightCheckInsByDateRange$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(WeightActions.loadWeightCheckInsByDateRange),
      switchMap(({ userId, startDate, endDate }) =>
        this.weightService
          .getWeightCheckInsInRange(userId, startDate, endDate)
          .pipe(
            mapResponse({
              next: (weightCheckIns) =>
                WeightActions.loadWeightCheckInsByDateRangeSuccess({
                  weightCheckIns,
                }),
              error: (error: HttpErrorResponse) =>
                WeightActions.loadWeightCheckInsByDateRangeFailure({ error }),
            })
          )
      )
    );
  });

  /**
   * Clear weight data effect
   */
  clearWeightData$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(WeightActions.clearWeightData),
      switchMap(() =>
        of(null).pipe(
          mapResponse({
            next: () => WeightActions.clearWeightDataSuccess(),
            error: (error: HttpErrorResponse) =>
              WeightActions.clearWeightDataFailure({ error }),
          })
        )
      )
    );
  });
}
