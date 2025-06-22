import { createFeatureSelector, createSelector } from '@ngrx/store';
import { State, adapter } from './workouts.reducers';

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

// Helper function to get date string for comparison
const getDateString = (date: Date): string => {
  return date.toISOString().split('T')[0];
};

// Business logic selectors
export const selectWorkoutsByDate = (date: Date) =>
  createSelector(selectAll, (workouts) => {
    const targetDateString = getDateString(date);

    return workouts.filter((workout) => {
      const workoutDateString = getDateString(new Date(workout.createdAt));
      return workoutDateString === targetDateString;
    });
  });

export const selectTodaysWorkouts = createSelector(selectAll, (workouts) => {
  const todayString = getDateString(new Date());

  return workouts.filter((workout) => {
    const workoutDateString = getDateString(new Date(workout.createdAt));
    return workoutDateString === todayString;
  });
});

export const selectTodaysTotalCalories = createSelector(
  selectTodaysWorkouts,
  (workouts) => workouts.reduce((total, workout) => total + workout.calories, 0)
);

export const selectWorkoutsByDateRange = (startDate: Date, endDate: Date) =>
  createSelector(selectAll, (workouts) => {
    const start = new Date(startDate);
    const end = new Date(endDate);
    start.setHours(0, 0, 0, 0);
    end.setHours(23, 59, 59, 999);

    return workouts.filter((workout) => {
      const workoutDate = new Date(workout.createdAt);
      return workoutDate >= start && workoutDate <= end;
    });
  });

export const selectTotalCaloriesByDateRange = (
  startDate: Date,
  endDate: Date
) =>
  createSelector(selectWorkoutsByDateRange(startDate, endDate), (workouts) =>
    workouts.reduce((total, workout) => total + workout.calories, 0)
  );
