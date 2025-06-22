import { WorkoutSource } from '../types/workout.type';

export interface WorkoutEntry {
  id: string; // workout id
  userId: string; // user id
  category: string; // e.g. "Running", "Yoga"
  name: string; // workout name
  calories: number; // calories
  source: WorkoutSource; // source of the workout entry
  createdAt: Date; // created at
}
