import { createReducer, on } from '@ngrx/store';
import {
  Notification,
  CheckInReminderNotification,
} from '@app/core/models/interfaces';
import * as NotificationsActions from './notifications.actions';

export interface NotificationsState {
  activeNotifications: Notification[];
  checkInReminder: CheckInReminderNotification | null;
  isLoading: boolean;
  error: string | null;
}

export const initialState: NotificationsState = {
  activeNotifications: [],
  checkInReminder: null,
  isLoading: false,
  error: null,
};

export const notificationsReducer = createReducer(
  initialState,

  // Check for check-in reminder
  on(
    NotificationsActions.checkForCheckInReminder,
    (state): NotificationsState => ({
      ...state,
      isLoading: true,
      error: null,
    })
  ),

  on(
    NotificationsActions.checkForCheckInReminderSuccess,
    (state, { notification }): NotificationsState => ({
      ...state,
      checkInReminder: notification,
      isLoading: false,
      error: null,
    })
  ),

  on(
    NotificationsActions.checkForCheckInReminderFailure,
    (state, { error }): NotificationsState => ({
      ...state,
      isLoading: false,
      error: error.error?.message || 'Failed to check for check-in reminder',
    })
  ),

  // Load active notifications
  on(
    NotificationsActions.loadActiveNotifications,
    (state): NotificationsState => ({
      ...state,
      isLoading: true,
      error: null,
    })
  ),

  on(
    NotificationsActions.loadActiveNotificationsSuccess,
    (state, { notifications }): NotificationsState => ({
      ...state,
      activeNotifications: notifications,
      isLoading: false,
      error: null,
    })
  ),

  on(
    NotificationsActions.loadActiveNotificationsFailure,
    (state, { error }): NotificationsState => ({
      ...state,
      isLoading: false,
      error: error.error?.message || 'Failed to load notifications',
    })
  ),

  // Mark notification as completed
  on(
    NotificationsActions.markNotificationCompleted,
    (state): NotificationsState => ({
      ...state,
      isLoading: true,
      error: null,
    })
  ),

  on(
    NotificationsActions.markNotificationCompletedSuccess,
    (state, { notificationId }): NotificationsState => ({
      ...state,
      activeNotifications: state.activeNotifications.filter(
        (notification) => notification.id !== notificationId
      ),
      checkInReminder:
        state.checkInReminder?.id === notificationId
          ? null
          : state.checkInReminder,
      isLoading: false,
      error: null,
    })
  ),

  on(
    NotificationsActions.markNotificationCompletedFailure,
    (state, { error }): NotificationsState => ({
      ...state,
      isLoading: false,
      error: error.error?.message || 'Failed to mark notification as completed',
    })
  ),

  // Dismiss notification
  on(
    NotificationsActions.dismissNotification,
    (state): NotificationsState => ({
      ...state,
      isLoading: true,
      error: null,
    })
  ),

  on(
    NotificationsActions.dismissNotificationSuccess,
    (state, { notificationId }): NotificationsState => ({
      ...state,
      activeNotifications: state.activeNotifications.filter(
        (notification) => notification.id !== notificationId
      ),
      checkInReminder:
        state.checkInReminder?.id === notificationId
          ? null
          : state.checkInReminder,
      isLoading: false,
      error: null,
    })
  ),

  on(
    NotificationsActions.dismissNotificationFailure,
    (state, { error }): NotificationsState => ({
      ...state,
      isLoading: false,
      error: error.error?.message || 'Failed to dismiss notification',
    })
  ),

  // Clear notifications
  on(
    NotificationsActions.clearNotifications,
    (state): NotificationsState => ({
      ...state,
      isLoading: true,
      error: null,
    })
  ),

  on(
    NotificationsActions.clearNotificationsSuccess,
    (state): NotificationsState => ({
      ...state,
      activeNotifications: [],
      checkInReminder: null,
      isLoading: false,
      error: null,
    })
  ),

  on(
    NotificationsActions.clearNotificationsFailure,
    (state, { error }): NotificationsState => ({
      ...state,
      isLoading: false,
      error: error.error?.message || 'Failed to clear notifications',
    })
  )
);
