import { MealEntry } from '@app/core/models/interfaces';
import { createEntityAdapter, EntityAdapter, EntityState } from '@ngrx/entity';
import { createReducer, on } from '@ngrx/store';
import * as MealsActions from './meals.actions';
import { HttpErrorResponse } from '@angular/common/http';

export const adapter: EntityAdapter<MealEntry> = createEntityAdapter<MealEntry>(
  {
    selectId: (meal: MealEntry) => meal.id,
    sortComparer: (a, b) => b.createdAt.getTime() - a.createdAt.getTime(),
  }
);

export interface State extends EntityState<MealEntry> {
  isLoading: boolean;
  error: HttpErrorResponse | null;
}

export const initialState: State = adapter.getInitialState({
  isLoading: false,
  error: null,
});

export const mealsReducer = createReducer(
  initialState,
  /**
   * Add meal actions
   */
  on(
    MealsActions.addMeal,
    (state): State => ({
      ...state,
      isLoading: true,
      error: null,
    })
  ),
  on(MealsActions.addMealSuccess, (state, { meal }): State => {
    return adapter.addOne(meal, {
      ...state,
      isLoading: false,
      error: null,
    });
  }),
  on(
    MealsActions.addMealFailure,
    (state, { error }): State => ({
      ...state,
      isLoading: false,
      error,
    })
  ),

  /**
   * Set meals actions
   */
  on(
    MealsActions.setMeals,
    (state): State => ({
      ...state,
      isLoading: true,
      error: null,
    })
  ),
  on(MealsActions.setMealsSuccess, (state, { meals }): State => {
    return adapter.setAll(meals, {
      ...state,
      isLoading: false,
      error: null,
    });
  }),
  on(
    MealsActions.setMealsFailure,
    (state, { error }): State => ({
      ...state,
      isLoading: false,
      error,
    })
  ),

  /**
   * Clear meals actions
   */
  on(
    MealsActions.clearMeals,
    (state): State => ({
      ...state,
      isLoading: true,
      error: null,
    })
  ),
  on(MealsActions.clearMealsSuccess, (state): State => {
    return adapter.removeAll({
      ...state,
      isLoading: false,
      error: null,
    });
  }),
  on(
    MealsActions.clearMealsFailure,
    (state, { error }): State => ({
      ...state,
      isLoading: false,
      error,
    })
  ),

  /**
   * Load meals for today actions
   */
  on(
    MealsActions.loadMealsForToday,
    (state): State => ({
      ...state,
      isLoading: true,
      error: null,
    })
  ),
  on(MealsActions.loadMealsForTodaySuccess, (state, { meals }): State => {
    return adapter.setAll(meals, {
      ...state,
      isLoading: false,
      error: null,
    });
  }),
  on(
    MealsActions.loadMealsForTodayFailure,
    (state, { error }): State => ({
      ...state,
      isLoading: false,
      error,
    })
  ),

  /**
   * Load meals for week actions
   */
  on(
    MealsActions.loadMealsForWeek,
    (state): State => ({
      ...state,
      isLoading: true,
      error: null,
    })
  ),
  on(MealsActions.loadMealsForWeekSuccess, (state, { meals }): State => {
    return adapter.setAll(meals, {
      ...state,
      isLoading: false,
      error: null,
    });
  }),
  on(
    MealsActions.loadMealsForWeekFailure,
    (state, { error }): State => ({
      ...state,
      isLoading: false,
      error,
    })
  )
);
