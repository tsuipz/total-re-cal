import { HttpErrorResponse } from '@angular/common/http';
import { WeightCheckIn } from '@app/core/models/interfaces';
import { createAction, props } from '@ngrx/store';

/**
 * Add weight check-in actions
 */
export const addWeightCheckIn = createAction(
  '[Weights] Add Weight Check-In',
  props<{ weight: number }>()
);

export const addWeightCheckInSuccess = createAction(
  '[Weights] Add Weight Check-In Success',
  props<{ weightCheckIn: WeightCheckIn }>()
);

export const addWeightCheckInFailure = createAction(
  '[Weights] Add Weight Check-In Failure',
  props<{ error: HttpErrorResponse }>()
);

/**
 * Load weight history actions
 */
export const loadWeightHistory = createAction(
  '[Weights] Load Weight History',
  props<{ userId: string }>()
);

export const loadWeightHistorySuccess = createAction(
  '[Weights] Load Weight History Success',
  props<{ weightCheckIns: WeightCheckIn[] }>()
);

export const loadWeightHistoryFailure = createAction(
  '[Weights] Load Weight History Failure',
  props<{ error: HttpErrorResponse }>()
);

/**
 * Load latest weight check-in actions
 */
export const loadLatestWeightCheckIn = createAction(
  '[Weights] Load Latest Weight Check-In',
  props<{ userId: string }>()
);

export const loadLatestWeightCheckInSuccess = createAction(
  '[Weights] Load Latest Weight Check-In Success',
  props<{ weightCheckIn: WeightCheckIn | null }>()
);

export const loadLatestWeightCheckInFailure = createAction(
  '[Weights] Load Latest Weight Check-In Failure',
  props<{ error: HttpErrorResponse }>()
);

/**
 * Load weight check-ins by date range actions
 */
export const loadWeightCheckInsByDateRange = createAction(
  '[Weights] Load Weight Check-Ins By Date Range',
  props<{ userId: string; startDate: Date; endDate: Date }>()
);

export const loadWeightCheckInsByDateRangeSuccess = createAction(
  '[Weights] Load Weight Check-Ins By Date Range Success',
  props<{ weightCheckIns: WeightCheckIn[] }>()
);

export const loadWeightCheckInsByDateRangeFailure = createAction(
  '[Weights] Load Weight Check-Ins By Date Range Failure',
  props<{ error: HttpErrorResponse }>()
);

/**
 * Clear weight data actions
 */
export const clearWeightData = createAction('[Weights] Clear Weight Data');

export const clearWeightDataSuccess = createAction(
  '[Weights] Clear Weight Data Success'
);

export const clearWeightDataFailure = createAction(
  '[Weights] Clear Weight Data Failure',
  props<{ error: HttpErrorResponse }>()
);
