import { HttpErrorResponse } from '@angular/common/http';
import { WorkoutEntry } from '@app/core/models/interfaces';
import { createAction, props } from '@ngrx/store';

/**
 * Add workout actions
 */
export const addWorkout = createAction(
  '[Workouts] Add Workout',
  props<{ workout: WorkoutEntry }>()
);

export const addWorkoutSuccess = createAction(
  '[Workouts] Add Workout Success',
  props<{ workout: WorkoutEntry }>()
);

export const addWorkoutFailure = createAction(
  '[Workouts] Add Workout Failure',
  props<{ error: HttpErrorResponse }>()
);

/**
 * Set workouts actions
 */
export const setWorkouts = createAction(
  '[Workouts] Set Workouts',
  props<{ workouts: WorkoutEntry[] }>()
);

export const setWorkoutsSuccess = createAction(
  '[Workouts] Set Workouts Success',
  props<{ workouts: WorkoutEntry[] }>()
);

export const setWorkoutsFailure = createAction(
  '[Workouts] Set Workouts Failure',
  props<{ error: HttpErrorResponse }>()
);

/**
 * Clear workouts actions
 */
export const clearWorkouts = createAction('[Workouts] Clear Workouts');

export const clearWorkoutsSuccess = createAction(
  '[Workouts] Clear Workouts Success'
);

export const clearWorkoutsFailure = createAction(
  '[Workouts] Clear Workouts Failure',
  props<{ error: HttpErrorResponse }>()
);
