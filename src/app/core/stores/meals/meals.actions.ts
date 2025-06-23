import { HttpErrorResponse } from '@angular/common/http';
import { MealEntry } from '@app/core/models/interfaces';
import { createAction, props } from '@ngrx/store';

/**
 * Add meal actions
 */
export const addMeal = createAction(
  '[Meals] Add Meal',
  props<{ meal: MealEntry }>()
);

export const addMealSuccess = createAction(
  '[Meals] Add Meal Success',
  props<{ meal: MealEntry }>()
);

export const addMealFailure = createAction(
  '[Meals] Add Meal Failure',
  props<{ error: HttpErrorResponse }>()
);

/**
 * Set meals actions
 */
export const setMeals = createAction(
  '[Meals] Set Meals',
  props<{ meals: MealEntry[] }>()
);

export const setMealsSuccess = createAction(
  '[Meals] Set Meals Success',
  props<{ meals: MealEntry[] }>()
);

export const setMealsFailure = createAction(
  '[Meals] Set Meals Failure',
  props<{ error: HttpErrorResponse }>()
);

/**
 * Clear meals actions
 */
export const clearMeals = createAction('[Meals] Clear Meals');

export const clearMealsSuccess = createAction('[Meals] Clear Meals Success');

export const clearMealsFailure = createAction(
  '[Meals] Clear Meals Failure',
  props<{ error: HttpErrorResponse }>()
);

/**
 * Load meals for today actions
 */
export const loadMealsForToday = createAction(
  '[Meals] Load Meals For Today',
  props<{ userId: string }>()
);

export const loadMealsForTodaySuccess = createAction(
  '[Meals] Load Meals For Today Success',
  props<{ meals: MealEntry[] }>()
);

export const loadMealsForTodayFailure = createAction(
  '[Meals] Load Meals For Today Failure',
  props<{ error: HttpErrorResponse }>()
);

/**
 * Load today's data actions (meals and workouts)
 */
export const loadTodaysData = createAction(
  "[Meals] Load Today's Data",
  props<{ userId: string }>()
);

/**
 * Load meals for week actions
 */
export const loadMealsForWeek = createAction(
  '[Meals] Load Meals For Week',
  props<{ userId: string }>()
);

export const loadMealsForWeekSuccess = createAction(
  '[Meals] Load Meals For Week Success',
  props<{ meals: MealEntry[] }>()
);

export const loadMealsForWeekFailure = createAction(
  '[Meals] Load Meals For Week Failure',
  props<{ error: HttpErrorResponse }>()
);

/**
 * Load week's data actions (meals and workouts)
 */
export const loadWeeksData = createAction(
  "[Meals] Load Week's Data",
  props<{ userId: string }>()
);
