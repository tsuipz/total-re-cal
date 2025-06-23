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
import { MealEntry } from '../models/interfaces';
import { DateUtilsService } from './date-utils.service';
import { subDays } from 'date-fns';

@Injectable({
  providedIn: 'root',
})
export class MealsService {
  private firestore = inject(Firestore);
  private dateUtils = inject(DateUtilsService);
  private mealsCollection = collection(this.firestore, 'meals');

  /**
   * Get meals for today for a specific user
   * @param userId - The user ID
   * @returns Observable of meal entries for today
   */
  getMealsForToday(userId: string): Observable<MealEntry[]> {
    const startOfToday = this.dateUtils.getStartOfTodayTimestamp();

    // Create a query to get all meals for the user for today
    const mealsQuery = query(
      this.mealsCollection,
      where('userId', '==', userId),
      where('createdAt', '>=', startOfToday)
    );

    // Get the meals for the user for today
    return collectionData(mealsQuery, { idField: 'id' }).pipe(
      map((docs) => {
        // Map the docs to the MealEntry interface
        return (docs as MealEntry[]).map((doc) => ({
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
   * Get meals for the last 7 days for a user
   * @param userId - The user ID
   * @returns Observable of meal entries for the last 7 days
   */
  getMealsForLast7Days(userId: string): Observable<MealEntry[]> {
    const endDate = new Date();
    const startDate = subDays(endDate, 6);

    const startTimestamp = this.dateUtils.getStartOfDay(startDate);
    const endTimestamp = this.dateUtils.getEndOfDay(endDate);

    const mealsQuery = query(
      this.mealsCollection,
      where('userId', '==', userId),
      where('createdAt', '>=', startTimestamp),
      where('createdAt', '<=', endTimestamp)
    );

    return collectionData(mealsQuery, { idField: 'id' }).pipe(
      map((docs) => {
        return (docs as MealEntry[]).map((doc) => ({
          ...doc,
          createdAt:
            doc.createdAt instanceof Timestamp
              ? doc.createdAt.toDate()
              : new Date(doc.createdAt),
        }));
      })
    );
  }

  /**
   * Create a new meal entry
   * @param meal - Meal data to create (without id and createdAt)
   * @returns Observable of the created meal with id and createdAt
   */
  createMeal(meal: MealEntry): Observable<MealEntry> {
    return from(addDoc(this.mealsCollection, meal)).pipe(
      map((docRef) => ({
        ...meal,
        id: docRef.id,
        createdAt: meal.createdAt,
      }))
    );
  }
}
