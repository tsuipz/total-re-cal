import { CheckInDay, Gender, GoalPlan, UnitSystem } from '../types/user.type';

export interface User {
  uid: string;
  name: string;
  email: string;

  // Demographic / body data
  gender: Gender;
  birthday: Date;
  height: number; // in cm or inches
  goalWeight: number;

  // Preferences
  unitSystem: UnitSystem;
  checkInDay: CheckInDay;
  goalPlan: GoalPlan;

  // Metadata
  createdAt: Date;
}
