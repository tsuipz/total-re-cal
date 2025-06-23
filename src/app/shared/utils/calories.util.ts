import { Gender, GoalPlan, UnitSystem } from '@app/core/models/types';
import { convertWeightToKg } from './weight.util';
import { convertHeightToCm } from './height.util';
import { calculateAge } from './age.util';

const SEDENTARY_MULTIPLIER = 1.2;
const CALORIES_PER_POUND = 3500;
const DAYS_IN_WEEK = 7;

export interface CalorieCalculationData {
  gender: Gender;
  age: number;
  heightCm: number;
  currentWeightKg: number;
}

export const profileDataForCalculations = (
  gender: Gender,
  birthday: Date,
  height: number,
  currentWeight: number,
  unitSystem: UnitSystem
): {
  gender: Gender;
  age: number;
  heightCm: number;
  currentWeightKg: number;
} => {
  const age = birthday ? calculateAge(birthday) : 0;

  const heightInCm = convertHeightToCm(height, unitSystem);
  const weightInKg = convertWeightToKg(currentWeight, unitSystem);

  return {
    gender,
    age,
    heightCm: heightInCm,
    currentWeightKg: weightInKg,
  };
};

export const calculateDailyCalorieTarget = (
  data: CalorieCalculationData,
  weeklyLossLbs: number
): number => {
  const bmr = calculateBMR(data);
  const maintenanceCalories = bmr * SEDENTARY_MULTIPLIER;
  const dailyDeficit = (weeklyLossLbs * CALORIES_PER_POUND) / DAYS_IN_WEEK;

  return Math.round(maintenanceCalories - dailyDeficit);
};

export const calculateBMR = (data: CalorieCalculationData): number => {
  const { gender, age, heightCm, currentWeightKg } = data;
  const weightFactor = 10 * currentWeightKg;
  const heightFactor = 6.25 * heightCm;
  const ageFactor = 5 * age;

  switch (gender) {
    case 'male':
      return weightFactor + heightFactor - ageFactor + 5;
    case 'female':
      return weightFactor + heightFactor - ageFactor - 161;
    default:
      // Average for non-binary/prefer-not-to-say
      return weightFactor + heightFactor - ageFactor - 78;
  }
};

export const getWeeklyLossLbs = (goalPlan: GoalPlan): 0.5 | 1.0 | 2.0 => {
  if (goalPlan === 'aggressive') {
    return 2.0;
  }

  if (goalPlan === 'moderate') {
    return 1.0;
  }

  return 0.5;
};
