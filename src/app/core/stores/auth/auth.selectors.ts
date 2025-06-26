import { createFeatureSelector, createSelector } from '@ngrx/store';
import { State } from './auth.reducers';
import {
  getWeeklyLossLbs,
  profileDataForCalculations,
  calculateDailyCalorieTarget,
} from '@app/shared/utils/calories.util';
import { WeightsSelectors } from '../weights';

const FEATURE_KEY = 'auth';

export const selectAuthState = createFeatureSelector<State>(FEATURE_KEY);

export const selectCurrentUserId = createSelector(
  selectAuthState,
  (state) => state.currentUserId
);

export const selectIsLoading = createSelector(
  selectAuthState,
  (state) => state.isLoading
);

export const selectUsersByIds = (userIds: string[]) =>
  createSelector(selectAuthState, (state) =>
    userIds.map((id) => state.entities[id]).filter((user) => user !== undefined)
  );

export const selectCurrentUser = createSelector(
  selectAuthState,
  selectCurrentUserId,
  (state, userId) => state.entities[userId ?? '']
);

export const selectCurrentUserPlan = createSelector(
  selectCurrentUser,
  (user) => {
    if (!user) {
      return null;
    }

    return getWeeklyLossLbs(user.goalPlan);
  }
);

/**
 * Get current weight from the latest weight check-in
 */
export const selectCurrentUserWeight = createSelector(
  WeightsSelectors.selectLatestWeightCheckIn,
  (latestCheckIn) => latestCheckIn?.weight || null
);

/**
 * Get profile data for calculations using current weight from weights collection
 */
export const selectCurrentUserProfileData = createSelector(
  selectCurrentUser,
  selectCurrentUserWeight,
  (user, currentWeight) => {
    if (!user || currentWeight === null) {
      return null;
    }

    return profileDataForCalculations(
      user.gender,
      user.birthday,
      user.height,
      currentWeight,
      user.unitSystem
    );
  }
);

/**
 * Calculate daily calorie goal using profile data and weight from weights collection
 */
export const selectCurrentUserDailyCaloriesGoal = createSelector(
  selectCurrentUserProfileData,
  selectCurrentUserPlan,
  (profileData, weeklyLoss) => {
    if (!profileData || !weeklyLoss) {
      return 0;
    }

    return calculateDailyCalorieTarget(profileData, weeklyLoss);
  }
);
