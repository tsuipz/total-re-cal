import { createFeatureSelector, createSelector } from '@ngrx/store';
import { State } from './auth.reducers';
import {
  getWeeklyLossLbs,
  profileDataForCalculations,
  calculateDailyCalorieTarget,
} from '@app/shared/utils/calories.util';

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

export const selectCurrentUserProfileData = createSelector(
  selectCurrentUser,
  (user) => {
    if (!user) {
      return null;
    }

    return profileDataForCalculations(
      user.gender,
      user.birthday,
      user.height,
      user.currentWeight,
      user.unitSystem
    );
  }
);

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
