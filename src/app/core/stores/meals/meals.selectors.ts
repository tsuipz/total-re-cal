import { createFeatureSelector, createSelector } from '@ngrx/store';
import { State, adapter } from './meals.reducers';
import { isSameDay, startOfDay, endOfDay, isWithinInterval } from 'date-fns';
import { selectTodaysTotalCalories as selectTodaysWorkoutsTotalCalories } from '@app/core/stores/workouts/workouts.selectors';
import { selectCurrentUserDailyCaloriesGoal } from '../auth/auth.selectors';

export const FEATURE_KEY = 'meals';

export const selectMealsState = createFeatureSelector<State>(FEATURE_KEY);

// Entity selectors
export const { selectIds, selectEntities, selectAll, selectTotal } =
  adapter.getSelectors(selectMealsState);

// Loading and error selectors
export const selectMealsIsLoading = createSelector(
  selectMealsState,
  (state) => state.isLoading
);

export const selectMealsError = createSelector(
  selectMealsState,
  (state) => state.error
);

// Business logic selectors
export const selectMealsByDate = (date: Date) =>
  createSelector(selectAll, (meals) => {
    return meals.filter((meal) => {
      const mealDate = new Date(meal.createdAt);
      return isSameDay(mealDate, date);
    });
  });

export const selectTodaysMeals = createSelector(selectAll, (meals) => {
  const today = new Date();

  return meals.filter((meal) => {
    const mealDate = new Date(meal.createdAt);
    return isSameDay(mealDate, today);
  });
});

export const selectTodaysTotalCalories = createSelector(
  selectTodaysMeals,
  (meals) => meals.reduce((total, meal) => total + meal.calories, 0)
);

export const selectTodaysNetCalories = createSelector(
  selectTodaysTotalCalories,
  selectTodaysWorkoutsTotalCalories,
  (meals, workouts) => meals - workouts
);

export const selectRemainingCalories = createSelector(
  selectTodaysNetCalories,
  selectCurrentUserDailyCaloriesGoal,
  (net, goal) => goal - net
);

export const selectTodaysTotalCaloriesProgress = createSelector(
  selectTodaysNetCalories,
  selectCurrentUserDailyCaloriesGoal,
  (net, target) => (net / target) * 100
);

export const selectMealsByDateRange = (startDate: Date, endDate: Date) =>
  createSelector(selectAll, (meals) => {
    const start = startOfDay(startDate);
    const end = endOfDay(endDate);
    const interval = { start, end };

    return meals.filter((meal) => {
      const mealDate = new Date(meal.createdAt);
      return isWithinInterval(mealDate, interval);
    });
  });

export const selectTotalCaloriesByDateRange = (
  startDate: Date,
  endDate: Date
) =>
  createSelector(selectMealsByDateRange(startDate, endDate), (meals) =>
    meals.reduce((total, meal) => total + meal.calories, 0)
  );
