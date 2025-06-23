import { Injectable, inject } from '@angular/core';
import {
  Firestore,
  collection,
  collectionData,
  query,
  where,
  Timestamp,
  addDoc,
} from '@angular/fire/firestore';
import { Observable, map, from } from 'rxjs';
import { WorkoutEntry } from '../models/interfaces';
import { DateUtilsService } from './date-utils.service';

@Injectable({
  providedIn: 'root',
})
export class WorkoutsService {
  private firestore = inject(Firestore);
  private dateUtils = inject(DateUtilsService);
  private workoutsCollection = collection(this.firestore, 'workouts');

  /**
   * Get workouts for today for a specific user
   * @param userId - The user ID
   * @returns Observable of workout entries for today
   */
  getWorkoutsForToday(userId: string): Observable<WorkoutEntry[]> {
    const startOfToday = this.dateUtils.getStartOfTodayTimestamp();

    const workoutsQuery = query(
      this.workoutsCollection,
      where('userId', '==', userId),
      where('createdAt', '>=', startOfToday)
    );

    return collectionData(workoutsQuery, { idField: 'id' }).pipe(
      map((docs) => {
        // Map the docs to the WorkoutEntry interface
        return (docs as WorkoutEntry[]).map((doc) => ({
          id: doc.id,
          userId: doc.userId,
          category: doc.category,
          name: doc.name,
          calories: doc.calories,
          source: doc.source,
          createdAt:
            doc.createdAt instanceof Timestamp
              ? doc.createdAt.toDate()
              : new Date(doc.createdAt),
        }));
      })
    );
  }

  /**
   * Create a new workout entry
   * @param workout - Workout data to create (without id and createdAt)
   * @returns Observable of the created workout with id and createdAt
   */
  createWorkout(workout: WorkoutEntry): Observable<WorkoutEntry> {
    return from(addDoc(this.workoutsCollection, workout)).pipe(
      map((docRef) => ({
        ...workout,
        id: docRef.id,
        createdAt: workout.createdAt,
      }))
    );
  }
}
