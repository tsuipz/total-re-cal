import { Injectable, inject } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { switchMap, tap } from 'rxjs';
import { mapResponse } from '@ngrx/operators';
import { HttpErrorResponse } from '@angular/common/http';
import { MatSnackBar } from '@angular/material/snack-bar';
import * as NotificationsActions from './notifications.actions';
import { NotificationService } from '../../services/notification.service';

@Injectable()
export class NotificationsEffects {
  private actions$ = inject(Actions);
  private notificationService = inject(NotificationService);
  private snackBar = inject(MatSnackBar);

  /**
   * Check for check-in reminder effect
   */
  public checkForCheckInReminder$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(NotificationsActions.checkForCheckInReminder),
      switchMap(({ userId }) =>
        this.notificationService.checkAndCreateCheckInReminder(userId).pipe(
          mapResponse({
            next: (notification) =>
              NotificationsActions.checkForCheckInReminderSuccess({
                notification,
              }),
            error: (error: HttpErrorResponse) =>
              NotificationsActions.checkForCheckInReminderFailure({ error }),
          })
        )
      )
    );
  });

  /**
   * Load active notifications effect
   */
  public loadActiveNotifications$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(NotificationsActions.loadActiveNotifications),
      switchMap(({ userId }) =>
        this.notificationService.getActiveNotifications(userId).pipe(
          mapResponse({
            next: (notifications) =>
              NotificationsActions.loadActiveNotificationsSuccess({
                notifications,
              }),
            error: (error: HttpErrorResponse) =>
              NotificationsActions.loadActiveNotificationsFailure({ error }),
          })
        )
      )
    );
  });

  /**
   * Mark notification as completed effect
   */
  public markNotificationCompleted$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(NotificationsActions.markNotificationCompleted),
      switchMap(({ notificationId }) =>
        this.notificationService.markNotificationCompleted(notificationId).pipe(
          mapResponse({
            next: () =>
              NotificationsActions.markNotificationCompletedSuccess({
                notificationId,
              }),
            error: (error: HttpErrorResponse) =>
              NotificationsActions.markNotificationCompletedFailure({ error }),
          })
        )
      )
    );
  });

  /**
   * Dismiss notification effect
   */
  public dismissNotification$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(NotificationsActions.dismissNotification),
      switchMap(({ notificationId }) =>
        this.notificationService.dismissNotification(notificationId).pipe(
          mapResponse({
            next: () =>
              NotificationsActions.dismissNotificationSuccess({
                notificationId,
              }),
            error: (error: HttpErrorResponse) =>
              NotificationsActions.dismissNotificationFailure({ error }),
          })
        )
      )
    );
  });

  /**
   * Clear notifications effect
   */
  public clearNotifications$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(NotificationsActions.clearNotifications),
      switchMap(() =>
        this.notificationService.getActiveNotifications('').pipe(
          mapResponse({
            next: () => NotificationsActions.clearNotificationsSuccess(),
            error: (error: HttpErrorResponse) =>
              NotificationsActions.clearNotificationsFailure({ error }),
          })
        )
      )
    );
  });

  /**
   * Show error messages effect
   */
  public showErrorMessages$ = createEffect(
    () => {
      return this.actions$.pipe(
        ofType(
          NotificationsActions.checkForCheckInReminderFailure,
          NotificationsActions.loadActiveNotificationsFailure,
          NotificationsActions.markNotificationCompletedFailure,
          NotificationsActions.dismissNotificationFailure,
          NotificationsActions.clearNotificationsFailure
        ),
        tap(({ error }) => {
          this.snackBar.open(
            error.error?.message || 'An error occurred with notifications',
            'Close',
            {
              duration: 5000,
              panelClass: 'error-snackbar',
            }
          );
        })
      );
    },
    { dispatch: false }
  );
}
