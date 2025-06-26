import { createFeatureSelector, createSelector } from '@ngrx/store';
import { State, adapter } from './meals.reducers';
import {
  isSameDay,
  startOfDay,
  endOfDay,
  isWithinInterval,
  subDays,
} from 'date-fns';
import { selectAll as selectAllWorkouts } from '../workouts/workouts.selectors';
import { selectTodaysTotalCalories as selectTodaysWorkoutsTotalCalories } from '@app/core/stores/workouts/workouts.selectors';
import { selectCurrentUserDailyCaloriesGoal } from '../auth/auth.selectors';
import { getLast7DaysAggregates } from '@app/shared/utils/calories.util';

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

/**
 * Select the average daily intake of calories
 * @param meals - The meals to select from
 * @returns The average daily intake of calories
 */
export const selectAverageDailyIntake = createSelector(selectAll, (meals) => {
  // If there are no meals, return 0
  if (!meals || meals.length === 0) {
    return 0;
  }

  // Add up all the calories
  const totalCalories = meals.reduce((total, meal) => total + meal.calories, 0);

  // Get the unique days with entries
  const uniqueDays = new Set(
    meals.map((meal) => startOfDay(new Date(meal.createdAt)).getTime())
  );
  const numberOfDaysWithEntries = uniqueDays.size;

  // If there are no days with entries, return 0
  if (numberOfDaysWithEntries === 0) {
    return 0;
  }

  // Calculate the average daily intake
  return Math.round(totalCalories / numberOfDaysWithEntries);
});

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

export const selectDaysOnTarget = createSelector(
  selectAll,
  selectAllWorkouts,
  selectCurrentUserDailyCaloriesGoal,
  (meals, workouts, dailyGoal) => {
    const MAX_DAYS = 7;
    if (!dailyGoal) return `0/${MAX_DAYS}`;

    // Initialize the daily stats map
    const dailyStats = new Map<string, { consumed: number; burned: number }>();

    // Initialize the last 7 days
    for (let i = 0; i < MAX_DAYS; i++) {
      const day = startOfDay(subDays(new Date(), i)).toISOString();
      dailyStats.set(day, { consumed: 0, burned: 0 });
    }

    // Process meals
    meals.forEach((meal) => {
      const day = startOfDay(new Date(meal.createdAt)).toISOString();
      // If the day is in the map, add the calories to the stats
      if (dailyStats.has(day)) {
        const stats = dailyStats.get(day)!;
        stats.consumed += meal.calories;
        dailyStats.set(day, stats);
      }
    });

    // Process workouts
    workouts.forEach((workout) => {
      const day = startOfDay(new Date(workout.createdAt)).toISOString();
      // If the day is in the map, add the calories to the stats
      if (dailyStats.has(day)) {
        const stats = dailyStats.get(day)!;
        stats.burned += workout.calories;
        dailyStats.set(day, stats);
      }
    });

    // Count the number of days on target
    let daysOnTarget = 0;
    dailyStats.forEach((stats) => {
      // If the consumed calories and burned calories are 0, don't count it
      if (stats.consumed === 0 && stats.burned === 0) return;

      // Calculate the net calories
      const netCalories = stats.consumed - stats.burned;

      // If the net calories are less than or equal to the daily goal, increment the days on target
      if (netCalories <= dailyGoal && netCalories > 0) {
        daysOnTarget++;
      }
    });

    return `${daysOnTarget}/${MAX_DAYS}`;
  }
);

/**
 * Selector for weekly insights component: last 7 days data in DailyCaloriesData format
 */
export const selectWeeklyDataForInsights = createSelector(
  selectAll,
  selectAllWorkouts,
  (meals, workouts) => {
    return getLast7DaysAggregates(meals, workouts);
  }
);

/**
 * Select rolling 7-day net calories (with goal) for charting
 */
/**
 * Selector that calculates rolling 7-day net calories data for charting
 * Returns an array of daily data with net calories and goal values
 */
export const selectRolling7DayNetCalories = createSelector(
  selectWeeklyDataForInsights,
  selectCurrentUserDailyCaloriesGoal,
  (weeklyData, dailyGoal) => {
    return weeklyData.map((d) => ({
      day: d.day,
      netCalories: d.intake - d.burned,
      goal: dailyGoal,
    }));
  }
);

/**
 * Selector for grouped bar chart: last 7 days, intake, burned, net, and max value for scaling
 */
export const selectWeeklyIntakeBurnedBarChart = createSelector(
  selectWeeklyDataForInsights,
  (weeklyData) => {
    return weeklyData.map((d) => ({
      day: d.day,
      intake: d.intake,
      burned: d.burned,
      net: d.intake - d.burned,
    }));
  }
);
