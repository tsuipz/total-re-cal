import { Injectable, inject } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { map, switchMap, tap } from 'rxjs/operators';
import { mapResponse } from '@ngrx/operators';
import { of } from 'rxjs';
import { MatSnackBar } from '@angular/material/snack-bar';
import * as WeightsActions from './weights.actions';
import { NotificationsActions, NotificationsSelectors } from '../notifications';
import { WeightsService } from '../../services/weights.service';
import { HttpErrorResponse } from '@angular/common/http';
import { Store } from '@ngrx/store';
import { take } from 'rxjs/operators';

@Injectable()
export class WeightsEffects {
  private actions$ = inject(Actions);
  private weightsService = inject(WeightsService);
  private snackBar = inject(MatSnackBar);
  private store = inject(Store);

  /**
   * Add weight check-in effect
   */
  addWeightCheckIn$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(WeightsActions.addWeightCheckIn),
      switchMap(({ weight }) =>
        this.weightsService.saveWeightCheckIn(weight).pipe(
          mapResponse({
            next: (weightCheckIn) =>
              WeightsActions.addWeightCheckInSuccess({ weightCheckIn }),
            error: (error: HttpErrorResponse) =>
              WeightsActions.addWeightCheckInFailure({ error }),
          })
        )
      )
    );
  });

  /**
   * Add weight check-in success effect - Show success message
   */
  addWeightCheckInSuccess$ = createEffect(
    () => {
      return this.actions$.pipe(
        ofType(WeightsActions.addWeightCheckInSuccess),
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
        })
      );
    },
    { dispatch: false }
  );

  /**
   * Mark check-in reminder as completed when weight check-in is successful
   */
  markCheckInReminderCompleted$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(WeightsActions.addWeightCheckInSuccess),
      switchMap(() =>
        this.store
          .select(NotificationsSelectors.selectCheckInReminderNotification)
          .pipe(
            take(1),
            map((reminder) => {
              if (reminder) {
                return NotificationsActions.markNotificationCompleted({
                  notificationId: reminder.id,
                });
              }
              return { type: 'NO_ACTION' };
            })
          )
      )
    );
  });

  /**
   * Load weight history effect
   */
  loadWeightHistory$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(WeightsActions.loadWeightHistory),
      switchMap(({ userId }) =>
        this.weightsService.getWeightHistory(userId).pipe(
          mapResponse({
            next: (weightCheckIns) =>
              WeightsActions.loadWeightHistorySuccess({ weightCheckIns }),
            error: (error: HttpErrorResponse) =>
              WeightsActions.loadWeightHistoryFailure({ error }),
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
      ofType(WeightsActions.loadLatestWeightCheckIn),
      switchMap(({ userId }) =>
        this.weightsService.getLatestWeightCheckIn(userId).pipe(
          mapResponse({
            next: (weightCheckIn) =>
              WeightsActions.loadLatestWeightCheckInSuccess({ weightCheckIn }),
            error: (error: HttpErrorResponse) =>
              WeightsActions.loadLatestWeightCheckInFailure({ error }),
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
      ofType(WeightsActions.loadWeightCheckInsByDateRange),
      switchMap(({ userId, startDate, endDate }) =>
        this.weightsService
          .getWeightCheckInsInRange(userId, startDate, endDate)
          .pipe(
            mapResponse({
              next: (weightCheckIns) =>
                WeightsActions.loadWeightCheckInsByDateRangeSuccess({
                  weightCheckIns,
                }),
              error: (error: HttpErrorResponse) =>
                WeightsActions.loadWeightCheckInsByDateRangeFailure({ error }),
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
      ofType(WeightsActions.clearWeightData),
      switchMap(() =>
        of(null).pipe(
          mapResponse({
            next: () => WeightsActions.clearWeightDataSuccess(),
            error: (error: HttpErrorResponse) =>
              WeightsActions.clearWeightDataFailure({ error }),
          })
        )
      )
    );
  });
}
