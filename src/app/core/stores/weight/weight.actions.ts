import { HttpErrorResponse } from '@angular/common/http';
import { WeightCheckIn } from '@app/core/models/interfaces';
import { createAction, props } from '@ngrx/store';

/**
 * Add weight check-in actions
 */
export const addWeightCheckIn = createAction(
  '[Weight] Add Weight Check-In',
  props<{ weight: number }>()
);

export const addWeightCheckInSuccess = createAction(
  '[Weight] Add Weight Check-In Success',
  props<{ weightCheckIn: WeightCheckIn }>()
);

export const addWeightCheckInFailure = createAction(
  '[Weight] Add Weight Check-In Failure',
  props<{ error: HttpErrorResponse }>()
);

/**
 * Load weight history actions
 */
export const loadWeightHistory = createAction(
  '[Weight] Load Weight History',
  props<{ userId: string }>()
);

export const loadWeightHistorySuccess = createAction(
  '[Weight] Load Weight History Success',
  props<{ weightCheckIns: WeightCheckIn[] }>()
);

export const loadWeightHistoryFailure = createAction(
  '[Weight] Load Weight History Failure',
  props<{ error: HttpErrorResponse }>()
);

/**
 * Load latest weight check-in actions
 */
export const loadLatestWeightCheckIn = createAction(
  '[Weight] Load Latest Weight Check-In',
  props<{ userId: string }>()
);

export const loadLatestWeightCheckInSuccess = createAction(
  '[Weight] Load Latest Weight Check-In Success',
  props<{ weightCheckIn: WeightCheckIn | null }>()
);

export const loadLatestWeightCheckInFailure = createAction(
  '[Weight] Load Latest Weight Check-In Failure',
  props<{ error: HttpErrorResponse }>()
);

/**
 * Load weight check-ins by date range actions
 */
export const loadWeightCheckInsByDateRange = createAction(
  '[Weight] Load Weight Check-Ins By Date Range',
  props<{ userId: string; startDate: Date; endDate: Date }>()
);

export const loadWeightCheckInsByDateRangeSuccess = createAction(
  '[Weight] Load Weight Check-Ins By Date Range Success',
  props<{ weightCheckIns: WeightCheckIn[] }>()
);

export const loadWeightCheckInsByDateRangeFailure = createAction(
  '[Weight] Load Weight Check-Ins By Date Range Failure',
  props<{ error: HttpErrorResponse }>()
);

/**
 * Clear weight data actions
 */
export const clearWeightData = createAction('[Weight] Clear Weight Data');

export const clearWeightDataSuccess = createAction(
  '[Weight] Clear Weight Data Success'
);

export const clearWeightDataFailure = createAction(
  '[Weight] Clear Weight Data Failure',
  props<{ error: HttpErrorResponse }>()
);
