import { WorkoutEntry } from '@app/core/models/interfaces';
import { createEntityAdapter, EntityAdapter, EntityState } from '@ngrx/entity';
import { createReducer, on } from '@ngrx/store';
import * as WorkoutsActions from './workouts.actions';
import { HttpErrorResponse } from '@angular/common/http';

export const adapter: EntityAdapter<WorkoutEntry> =
  createEntityAdapter<WorkoutEntry>({
    selectId: (workout: WorkoutEntry) => workout.id,
    sortComparer: (a, b) => b.createdAt.getTime() - a.createdAt.getTime(),
  });

export interface State extends EntityState<WorkoutEntry> {
  isLoading: boolean;
  error: HttpErrorResponse | null;
}

export const initialState: State = adapter.getInitialState({
  isLoading: false,
  error: null,
});

export const workoutsReducer = createReducer(
  initialState,
  /**
   * Add workout actions
   */
  on(
    WorkoutsActions.addWorkout,
    (state): State => ({
      ...state,
      isLoading: true,
      error: null,
    })
  ),
  on(WorkoutsActions.addWorkoutSuccess, (state, { workout }): State => {
    return adapter.addOne(workout, {
      ...state,
      isLoading: false,
      error: null,
    });
  }),
  on(
    WorkoutsActions.addWorkoutFailure,
    (state, { error }): State => ({
      ...state,
      isLoading: false,
      error,
    })
  ),

  /**
   * Set workouts actions
   */
  on(
    WorkoutsActions.setWorkouts,
    (state): State => ({
      ...state,
      isLoading: true,
      error: null,
    })
  ),
  on(WorkoutsActions.setWorkoutsSuccess, (state, { workouts }): State => {
    return adapter.setAll(workouts, {
      ...state,
      isLoading: false,
      error: null,
    });
  }),
  on(
    WorkoutsActions.setWorkoutsFailure,
    (state, { error }): State => ({
      ...state,
      isLoading: false,
      error,
    })
  ),

  /**
   * Clear workouts actions
   */
  on(
    WorkoutsActions.clearWorkouts,
    (state): State => ({
      ...state,
      isLoading: true,
      error: null,
    })
  ),
  on(WorkoutsActions.clearWorkoutsSuccess, (state): State => {
    return adapter.removeAll({
      ...state,
      isLoading: false,
      error: null,
    });
  }),
  on(
    WorkoutsActions.clearWorkoutsFailure,
    (state, { error }): State => ({
      ...state,
      isLoading: false,
      error,
    })
  )
);
