import { WeightCheckIn } from '@app/core/models/interfaces';
import { createEntityAdapter, EntityAdapter, EntityState } from '@ngrx/entity';
import { createReducer, on } from '@ngrx/store';
import * as WeightsActions from './weights.actions';
import { HttpErrorResponse } from '@angular/common/http';

export const adapter: EntityAdapter<WeightCheckIn> =
  createEntityAdapter<WeightCheckIn>({
    selectId: (weightCheckIn: WeightCheckIn) => weightCheckIn.id!,
    sortComparer: (a, b) => b.createdAt.getTime() - a.createdAt.getTime(),
  });

export interface State extends EntityState<WeightCheckIn> {
  isLoading: boolean;
  error: HttpErrorResponse | null;
  latestWeightCheckIn: WeightCheckIn | null;
  previousWeightCheckIn: WeightCheckIn | null;
}

export const initialState: State = adapter.getInitialState({
  isLoading: false,
  error: null,
  latestWeightCheckIn: null,
  previousWeightCheckIn: null,
});

export const weightsReducer = createReducer(
  initialState,
  /**
   * Add weight check-in actions
   */
  on(
    WeightsActions.addWeightCheckIn,
    (state): State => ({
      ...state,
      isLoading: true,
      error: null,
    })
  ),
  on(
    WeightsActions.addWeightCheckInSuccess,
    (state, { weightCheckIn }): State => {
      // Update the latest weight check-in
      const newLatestWeightCheckIn = weightCheckIn;
      const newPreviousWeightCheckIn = state.latestWeightCheckIn;

      return adapter.addOne(weightCheckIn, {
        ...state,
        isLoading: false,
        error: null,
        latestWeightCheckIn: newLatestWeightCheckIn,
        previousWeightCheckIn: newPreviousWeightCheckIn,
      });
    }
  ),
  on(
    WeightsActions.addWeightCheckInFailure,
    (state, { error }): State => ({
      ...state,
      isLoading: false,
      error,
    })
  ),

  /**
   * Load weight history actions
   */
  on(
    WeightsActions.loadWeightHistory,
    (state): State => ({
      ...state,
      isLoading: true,
      error: null,
    })
  ),
  on(
    WeightsActions.loadWeightHistorySuccess,
    (state, { weightCheckIns }): State => {
      // Set the latest and previous weight check-ins based on the loaded data
      const sortedCheckIns = [...weightCheckIns].sort(
        (a, b) => b.createdAt.getTime() - a.createdAt.getTime()
      );
      const latest = sortedCheckIns.length > 0 ? sortedCheckIns[0] : null;
      const previous = sortedCheckIns.length > 1 ? sortedCheckIns[1] : null;

      return adapter.setAll(weightCheckIns, {
        ...state,
        isLoading: false,
        error: null,
        latestWeightCheckIn: latest,
        previousWeightCheckIn: previous,
      });
    }
  ),
  on(
    WeightsActions.loadWeightHistoryFailure,
    (state, { error }): State => ({
      ...state,
      isLoading: false,
      error,
    })
  ),

  /**
   * Load latest weight check-in actions
   */
  on(
    WeightsActions.loadLatestWeightCheckIn,
    (state): State => ({
      ...state,
      isLoading: true,
      error: null,
    })
  ),
  on(
    WeightsActions.loadLatestWeightCheckInSuccess,
    (state, { weightCheckIn }): State => ({
      ...state,
      isLoading: false,
      error: null,
      latestWeightCheckIn: weightCheckIn,
    })
  ),
  on(
    WeightsActions.loadLatestWeightCheckInFailure,
    (state, { error }): State => ({
      ...state,
      isLoading: false,
      error,
    })
  ),

  /**
   * Load weight check-ins by date range actions
   */
  on(
    WeightsActions.loadWeightCheckInsByDateRange,
    (state): State => ({
      ...state,
      isLoading: true,
      error: null,
    })
  ),
  on(
    WeightsActions.loadWeightCheckInsByDateRangeSuccess,
    (state, { weightCheckIns }): State => {
      // Add the weight check-ins to the existing state without replacing
      return adapter.addMany(weightCheckIns, {
        ...state,
        isLoading: false,
        error: null,
      });
    }
  ),
  on(
    WeightsActions.loadWeightCheckInsByDateRangeFailure,
    (state, { error }): State => ({
      ...state,
      isLoading: false,
      error,
    })
  ),

  /**
   * Clear weight data actions
   */
  on(
    WeightsActions.clearWeightData,
    (state): State => ({
      ...state,
      isLoading: true,
      error: null,
    })
  ),
  on(WeightsActions.clearWeightDataSuccess, (state): State => {
    return adapter.removeAll({
      ...state,
      isLoading: false,
      error: null,
      latestWeightCheckIn: null,
      previousWeightCheckIn: null,
    });
  }),
  on(
    WeightsActions.clearWeightDataFailure,
    (state, { error }): State => ({
      ...state,
      isLoading: false,
      error,
    })
  )
);
