import { CheckInDay, Gender, GoalPlan, UnitSystem } from '../types/user.type';

export interface User {
  uid: string;
  name: string;
  email: string;

  // Demographic / body data
  gender: Gender;
  birthday: Date; // ISO date string
  height: number; // in cm or inches
  currentWeight: number; // in lbs or kg
  goalWeight: number;

  // Preferences
  unitSystem: UnitSystem;
  checkInDay: CheckInDay;
  goalPlan: GoalPlan;

  // Calculated
  calorieTarget: number;

  // Metadata
  createdAt: string; // ISO date
}
