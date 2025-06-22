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
