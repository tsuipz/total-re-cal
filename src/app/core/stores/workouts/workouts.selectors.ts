import { createFeatureSelector, createSelector } from '@ngrx/store';
import { State, adapter } from './workouts.reducers';
import { isSameDay, startOfDay, endOfDay, isWithinInterval } from 'date-fns';

export const FEATURE_KEY = 'workouts';

export const selectWorkoutsState = createFeatureSelector<State>(FEATURE_KEY);

// Entity selectors
export const { selectIds, selectEntities, selectAll, selectTotal } =
  adapter.getSelectors(selectWorkoutsState);

// Loading and error selectors
export const selectWorkoutsIsLoading = createSelector(
  selectWorkoutsState,
  (state) => state.isLoading
);

export const selectWorkoutsError = createSelector(
  selectWorkoutsState,
  (state) => state.error
);

// Business logic selectors
export const selectWorkoutsByDate = (date: Date) =>
  createSelector(selectAll, (workouts) => {
    return workouts.filter((workout) => {
      const workoutDate = new Date(workout.createdAt);
      return isSameDay(workoutDate, date);
    });
  });

export const selectTodaysWorkouts = createSelector(selectAll, (workouts) => {
  const today = new Date();

  return workouts.filter((workout) => {
    const workoutDate = new Date(workout.createdAt);
    return isSameDay(workoutDate, today);
  });
});

export const selectTodaysTotalCalories = createSelector(
  selectTodaysWorkouts,
  (workouts) => workouts.reduce((total, workout) => total + workout.calories, 0)
);

export const selectWorkoutsByDateRange = (startDate: Date, endDate: Date) =>
  createSelector(selectAll, (workouts) => {
    const start = startOfDay(startDate);
    const end = endOfDay(endDate);
    const interval = { start, end };

    return workouts.filter((workout) => {
      const workoutDate = new Date(workout.createdAt);
      return isWithinInterval(workoutDate, interval);
    });
  });

export const selectTotalCaloriesByDateRange = (
  startDate: Date,
  endDate: Date
) =>
  createSelector(selectWorkoutsByDateRange(startDate, endDate), (workouts) =>
    workouts.reduce((total, workout) => total + workout.calories, 0)
  );
