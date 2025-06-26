import { HttpErrorResponse } from '@angular/common/http';
import {
  Notification,
  CheckInReminderNotification,
} from '@app/core/models/interfaces';
import { createAction, props } from '@ngrx/store';

/**
 * Check for check-in reminder actions
 */
export const checkForCheckInReminder = createAction(
  '[Notifications] Check For Check-In Reminder',
  props<{ userId: string }>()
);

export const checkForCheckInReminderSuccess = createAction(
  '[Notifications] Check For Check-In Reminder Success',
  props<{ notification: CheckInReminderNotification | null }>()
);

export const checkForCheckInReminderFailure = createAction(
  '[Notifications] Check For Check-In Reminder Failure',
  props<{ error: HttpErrorResponse }>()
);

/**
 * Load active notifications actions
 */
export const loadActiveNotifications = createAction(
  '[Notifications] Load Active Notifications',
  props<{ userId: string }>()
);

export const loadActiveNotificationsSuccess = createAction(
  '[Notifications] Load Active Notifications Success',
  props<{ notifications: Notification[] }>()
);

export const loadActiveNotificationsFailure = createAction(
  '[Notifications] Load Active Notifications Failure',
  props<{ error: HttpErrorResponse }>()
);

/**
 * Mark notification as completed actions
 */
export const markNotificationCompleted = createAction(
  '[Notifications] Mark Notification Completed',
  props<{ notificationId: string }>()
);

export const markNotificationCompletedSuccess = createAction(
  '[Notifications] Mark Notification Completed Success',
  props<{ notificationId: string }>()
);

export const markNotificationCompletedFailure = createAction(
  '[Notifications] Mark Notification Completed Failure',
  props<{ error: HttpErrorResponse }>()
);

/**
 * Dismiss notification actions
 */
export const dismissNotification = createAction(
  '[Notifications] Dismiss Notification',
  props<{ notificationId: string }>()
);

export const dismissNotificationSuccess = createAction(
  '[Notifications] Dismiss Notification Success',
  props<{ notificationId: string }>()
);

export const dismissNotificationFailure = createAction(
  '[Notifications] Dismiss Notification Failure',
  props<{ error: HttpErrorResponse }>()
);

/**
 * Clear notifications actions
 */
export const clearNotifications = createAction(
  '[Notifications] Clear Notifications'
);

export const clearNotificationsSuccess = createAction(
  '[Notifications] Clear Notifications Success'
);

export const clearNotificationsFailure = createAction(
  '[Notifications] Clear Notifications Failure',
  props<{ error: HttpErrorResponse }>()
);
