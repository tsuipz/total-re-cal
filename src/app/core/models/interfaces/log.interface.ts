export interface DailyLog {
  id: string; // daily log id
  userId: string; // user id

  // Calories
  consumedCalories: number;
  burnedCalories: number;
  netCalories: number;
  calorieTarget: number;

  // References
  mealIds?: string[]; // meal ids
  workoutIds?: string[]; // workout ids

  // Activity log extras
  weightCheckIn?: number; // lbs or kg
  goalUpdated?: boolean;
  createdAt: Date; // created at
}
