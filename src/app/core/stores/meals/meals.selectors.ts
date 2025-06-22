import { createFeatureSelector, createSelector } from '@ngrx/store';
import { State, adapter } from './meals.reducers';

const FEATURE_KEY = 'meals';

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

// Helper function to get date string for comparison
const getDateString = (date: Date): string => {
  return date.toISOString().split('T')[0];
};

// Business logic selectors
export const selectMealsByDate = (date: Date) =>
  createSelector(selectAll, (meals) => {
    const targetDateString = getDateString(date);

    return meals.filter((meal) => {
      const mealDateString = getDateString(new Date(meal.createdAt));
      return mealDateString === targetDateString;
    });
  });

export const selectTodaysMeals = createSelector(selectAll, (meals) => {
  const todayString = getDateString(new Date());

  return meals.filter((meal) => {
    const mealDateString = getDateString(new Date(meal.createdAt));
    return mealDateString === todayString;
  });
});

export const selectTodaysTotalCalories = createSelector(
  selectTodaysMeals,
  (meals) => meals.reduce((total, meal) => total + meal.calories, 0)
);

export const selectMealsByDateRange = (startDate: Date, endDate: Date) =>
  createSelector(selectAll, (meals) => {
    const start = new Date(startDate);
    const end = new Date(endDate);
    start.setHours(0, 0, 0, 0);
    end.setHours(23, 59, 59, 999);

    return meals.filter((meal) => {
      const mealDate = new Date(meal.createdAt);
      return mealDate >= start && mealDate <= end;
    });
  });

export const selectTotalCaloriesByDateRange = (
  startDate: Date,
  endDate: Date
) =>
  createSelector(selectMealsByDateRange(startDate, endDate), (meals) =>
    meals.reduce((total, meal) => total + meal.calories, 0)
  );
