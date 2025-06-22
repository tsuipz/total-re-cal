import { MealSource } from '../types/meal.type';

export interface MealEntry {
  id: string; // meal id
  userId: string; // user id
  category: string; // breakfast, lunch, dinner, snack
  name: string; // meal name
  calories: number; // calories
  source: MealSource; // source of the meal entry
  createdAt: Date; // created at
}
