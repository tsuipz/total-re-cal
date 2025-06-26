import { createFeatureSelector, createSelector } from '@ngrx/store';
import { NotificationsState } from './notifications.reducer';

export const selectNotificationsState =
  createFeatureSelector<NotificationsState>('notifications');

export const selectActiveNotifications = createSelector(
  selectNotificationsState,
  (state) => state.activeNotifications
);

export const selectCheckInReminder = createSelector(
  selectNotificationsState,
  (state) => state.checkInReminder
);

export const selectNotificationsIsLoading = createSelector(
  selectNotificationsState,
  (state) => state.isLoading
);

export const selectNotificationsError = createSelector(
  selectNotificationsState,
  (state) => state.error
);

export const selectHasActiveNotifications = createSelector(
  selectActiveNotifications,
  selectCheckInReminder,
  (activeNotifications, checkInReminder) =>
    activeNotifications.length > 0 || checkInReminder !== null
);

export const selectCheckInReminderNotification = createSelector(
  selectCheckInReminder,
  (checkInReminder) => checkInReminder
);
