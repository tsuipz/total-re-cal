import { createFeatureSelector, createSelector } from '@ngrx/store';
import { State, adapter } from './weight.reducers';
import {
  isSameDay,
  startOfDay,
  endOfDay,
  isWithinInterval,
  subDays,
} from 'date-fns';

export const FEATURE_KEY = 'weight';

export const selectWeightState = createFeatureSelector<State>(FEATURE_KEY);

// Entity selectors
export const { selectIds, selectEntities, selectAll, selectTotal } =
  adapter.getSelectors(selectWeightState);

// Loading and error selectors
export const selectWeightIsLoading = createSelector(
  selectWeightState,
  (state) => state.isLoading
);

export const selectWeightError = createSelector(
  selectWeightState,
  (state) => state.error
);

// Latest and previous weight check-in selectors
export const selectLatestWeightCheckIn = createSelector(
  selectWeightState,
  (state) => state.latestWeightCheckIn
);

export const selectPreviousWeightCheckIn = createSelector(
  selectWeightState,
  (state) => state.previousWeightCheckIn
);

// Business logic selectors
export const selectWeightCheckInsByDate = (date: Date) =>
  createSelector(selectAll, (weightCheckIns) => {
    return weightCheckIns.filter((checkIn) => {
      const checkInDate = new Date(checkIn.createdAt);
      return isSameDay(checkInDate, date);
    });
  });

export const selectTodaysWeightCheckIn = createSelector(
  selectAll,
  (weightCheckIns) => {
    const today = new Date();

    return weightCheckIns.find((checkIn) => {
      const checkInDate = new Date(checkIn.createdAt);
      return isSameDay(checkInDate, today);
    });
  }
);

export const selectWeightCheckInsByDateRange = (
  startDate: Date,
  endDate: Date
) =>
  createSelector(selectAll, (weightCheckIns) => {
    const start = startOfDay(startDate);
    const end = endOfDay(endDate);
    const interval = { start, end };

    return weightCheckIns.filter((checkIn) => {
      const checkInDate = new Date(checkIn.createdAt);
      return isWithinInterval(checkInDate, interval);
    });
  });

export const selectWeightCheckInsByWeek = (weeksBack = 0) =>
  createSelector(selectAll, (weightCheckIns) => {
    const endDate = new Date();
    const startDate = subDays(endDate, weeksBack * 7);
    const end = endOfDay(endDate);
    const start = startOfDay(startDate);
    const interval = { start, end };

    return weightCheckIns.filter((checkIn) => {
      const checkInDate = new Date(checkIn.createdAt);
      return isWithinInterval(checkInDate, interval);
    });
  });

export const selectWeightCheckInsByMonth = (monthsBack = 0) =>
  createSelector(selectAll, (weightCheckIns) => {
    const endDate = new Date();
    const startDate = new Date(
      endDate.getFullYear(),
      endDate.getMonth() - monthsBack,
      1
    );
    const end = endOfDay(endDate);
    const start = startOfDay(startDate);
    const interval = { start, end };

    return weightCheckIns.filter((checkIn) => {
      const checkInDate = new Date(checkIn.createdAt);
      return isWithinInterval(checkInDate, interval);
    });
  });

// Weight trend selectors
export const selectWeightDifference = createSelector(
  selectLatestWeightCheckIn,
  selectPreviousWeightCheckIn,
  (latest, previous) => {
    if (!latest || !previous) {
      return null;
    }
    return latest.weight - previous.weight;
  }
);

export const selectWeightTrend = createSelector(
  selectWeightDifference,
  (difference) => {
    if (difference === null) {
      return 'no-data';
    }
    return difference > 0
      ? 'increasing'
      : difference < 0
      ? 'decreasing'
      : 'stable';
  }
);

export const selectWeightChangePercentage = createSelector(
  selectLatestWeightCheckIn,
  selectPreviousWeightCheckIn,
  (latest, previous) => {
    if (!latest || !previous || previous.weight === 0) {
      return null;
    }
    return ((latest.weight - previous.weight) / previous.weight) * 100;
  }
);

// Average weight selectors
export const selectAverageWeightByDateRange = (
  startDate: Date,
  endDate: Date
) =>
  createSelector(
    selectWeightCheckInsByDateRange(startDate, endDate),
    (weightCheckIns) => {
      if (weightCheckIns.length === 0) {
        return null;
      }
      const totalWeight = weightCheckIns.reduce(
        (sum, checkIn) => sum + checkIn.weight,
        0
      );
      return totalWeight / weightCheckIns.length;
    }
  );

export const selectAverageWeightByWeek = (weeksBack = 0) =>
  createSelector(selectWeightCheckInsByWeek(weeksBack), (weightCheckIns) => {
    if (weightCheckIns.length === 0) {
      return null;
    }
    const totalWeight = weightCheckIns.reduce(
      (sum, checkIn) => sum + checkIn.weight,
      0
    );
    return totalWeight / weightCheckIns.length;
  });

export const selectAverageWeightByMonth = (monthsBack = 0) =>
  createSelector(selectWeightCheckInsByMonth(monthsBack), (weightCheckIns) => {
    if (weightCheckIns.length === 0) {
      return null;
    }
    const totalWeight = weightCheckIns.reduce(
      (sum, checkIn) => sum + checkIn.weight,
      0
    );
    return totalWeight / weightCheckIns.length;
  });

// Weight goal progress selectors
export const selectWeightGoalProgress = createSelector(
  selectLatestWeightCheckIn,
  () => {
    // This would need to be connected to user's goal weight
    // For now, return null - can be enhanced later
    return null;
  }
);

// Check-in frequency selectors
export const selectCheckInFrequency = createSelector(
  selectAll,
  (weightCheckIns) => {
    if (weightCheckIns.length < 2) {
      return null;
    }

    const sortedCheckIns = weightCheckIns.sort(
      (a, b) => b.createdAt.getTime() - a.createdAt.getTime()
    );
    const totalDays = Math.ceil(
      (sortedCheckIns[0].createdAt.getTime() -
        sortedCheckIns[sortedCheckIns.length - 1].createdAt.getTime()) /
        (1000 * 60 * 60 * 24)
    );

    return totalDays / (weightCheckIns.length - 1); // Average days between check-ins
  }
);

// Weekly check-in status
export const selectWeeklyCheckInStatus = createSelector(
  selectLatestWeightCheckIn,
  (latest) => {
    if (!latest) {
      return 'no-check-ins';
    }

    const daysSinceLastCheckIn = Math.ceil(
      (new Date().getTime() - latest.createdAt.getTime()) /
        (1000 * 60 * 60 * 24)
    );

    if (daysSinceLastCheckIn <= 7) {
      return 'recent';
    } else if (daysSinceLastCheckIn <= 14) {
      return 'overdue';
    } else {
      return 'very-overdue';
    }
  }
);
