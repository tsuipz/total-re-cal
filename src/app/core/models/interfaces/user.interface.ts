export interface User {
  uid: string;
  name: string;
  email: string;

  // Demographic / body data
  gender: 'male' | 'female' | 'non-binary' | 'prefer-not-to-say';
  age: number;
  height: number; // in cm or inches
  currentWeight: number; // in lbs or kg
  goalWeight: number;

  // Preferences
  unitSystem: 'imperial' | 'metric';
  checkInDay:
    | 'Monday'
    | 'Tuesday'
    | 'Wednesday'
    | 'Thursday'
    | 'Friday'
    | 'Saturday'
    | 'Sunday';
  goalPlan: 'slow' | 'moderate' | 'aggressive';

  // Calculated
  calorieTarget: number;
  projectedGoalDate?: string;

  // Metadata
  createdAt: string; // ISO date
  lastCheckInAt?: string; // ISO date
}
