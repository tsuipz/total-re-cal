import { Injectable, inject } from '@angular/core';
import {
  Firestore,
  collection,
  collectionData,
  query,
  where,
  orderBy,
  addDoc,
  limit,
  Timestamp,
} from '@angular/fire/firestore';
import { Observable, map, switchMap, from, take } from 'rxjs';
import { WeightCheckIn } from '../models/interfaces';
import { UserService } from './user.service';
import { DateUtilsService } from './date-utils.service';

@Injectable({
  providedIn: 'root',
})
export class WeightService {
  private firestore = inject(Firestore);
  private userService = inject(UserService);
  private dateUtils = inject(DateUtilsService);
  private weightCheckInsCollection = collection(
    this.firestore,
    'weightCheckIns'
  );

  /**
   * Save a weight check-in to Firestore (without updating user profile)
   * @param weight - The weight value
   * @returns Observable that completes when the check-in is saved
   */
  public saveWeightCheckIn(weight: number): Observable<WeightCheckIn> {
    return this.userService.getUserProfile().pipe(
      switchMap((currentUser) => {
        currentUser.currentWeight = weight;

        if (!currentUser) {
          throw new Error('No authenticated user found');
        }

        const weightCheckIn: Omit<WeightCheckIn, 'id'> = {
          userId: currentUser.uid,
          weight,
          createdAt: new Date(),
        };

        // Add the weight check-in to Firestore
        const addCheckIn$ = from(
          addDoc(this.weightCheckInsCollection, weightCheckIn)
        );

        // Combine both operations
        return addCheckIn$.pipe(
          take(1),
          map((addCheckIn) => {
            const newWeightCheckIn: WeightCheckIn = {
              ...weightCheckIn,
              id: addCheckIn.id,
            };

            return newWeightCheckIn;
          })
        );
      })
    );
  }

  /**
   * Get weight history for a specific user
   * @param userId - The user ID
   * @returns Observable of weight check-ins ordered by date
   */
  public getWeightHistory(userId: string): Observable<WeightCheckIn[]> {
    const weightQuery = query(
      this.weightCheckInsCollection,
      where('userId', '==', userId),
      orderBy('createdAt', 'desc')
    );

    return collectionData(weightQuery, { idField: 'id' }).pipe(
      take(1),
      map((docs) => {
        return (docs as WeightCheckIn[]).map((doc) => ({
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
   * Get weight history for the current user
   * @returns Observable of weight check-ins for the current user
   */
  public getCurrentUserWeightHistory(): Observable<WeightCheckIn[]> {
    return this.userService.getUserProfile().pipe(
      take(1),
      switchMap((user) => {
        if (!user) {
          throw new Error('No authenticated user found');
        }
        return this.getWeightHistory(user.uid);
      })
    );
  }

  /**
   * Get the most recent weight check-in for a user
   * @param userId - The user ID
   * @returns Observable of the most recent weight check-in
   */
  public getLatestWeightCheckIn(
    userId: string
  ): Observable<WeightCheckIn | null> {
    const weightCheckInQuery = query(
      this.weightCheckInsCollection,
      where('userId', '==', userId),
      orderBy('createdAt', 'desc'),
      limit(1)
    );

    return collectionData(weightCheckInQuery, { idField: 'id' }).pipe(
      take(1),
      map((docs) => {
        if (docs.length === 0) {
          return null;
        }

        const doc = docs[0] as WeightCheckIn;
        return {
          ...doc,
          createdAt:
            doc.createdAt instanceof Timestamp
              ? doc.createdAt.toDate()
              : new Date(doc.createdAt),
        };
      })
    );
  }

  /**
   * Get the previous weight check-in (second most recent) for a user
   * @param userId - The user ID
   * @returns Observable of the previous weight check-in
   */
  public getPreviousWeightCheckIn(
    userId: string
  ): Observable<WeightCheckIn | null> {
    const weightCheckInQuery = query(
      this.weightCheckInsCollection,
      where('userId', '==', userId),
      orderBy('createdAt', 'desc'),
      limit(2)
    );

    return collectionData(weightCheckInQuery, { idField: 'id' }).pipe(
      take(1),
      map((docs) => {
        if (docs.length < 2) {
          return null;
        }

        const doc = docs[1] as WeightCheckIn; // Get the second most recent
        return {
          ...doc,
          createdAt:
            doc.createdAt instanceof Timestamp
              ? doc.createdAt.toDate()
              : new Date(doc.createdAt),
        };
      })
    );
  }

  /**
   * Get weight check-ins for a specific date range
   * @param userId - The user ID
   * @param startDate - Start date
   * @param endDate - End date
   * @returns Observable of weight check-ins in the date range
   */
  public getWeightCheckInsInRange(
    userId: string,
    startDate: Date,
    endDate: Date
  ): Observable<WeightCheckIn[]> {
    const startTimestamp = this.dateUtils.getStartOfDay(startDate);
    const endTimestamp = this.dateUtils.getEndOfDay(endDate);

    const weightCheckInQuery = query(
      this.weightCheckInsCollection,
      where('userId', '==', userId),
      where('createdAt', '>=', startTimestamp),
      where('createdAt', '<=', endTimestamp),
      orderBy('createdAt', 'desc')
    );

    return collectionData(weightCheckInQuery, { idField: 'id' }).pipe(
      take(1),
      map((docs) => {
        return (docs as WeightCheckIn[]).map((doc) => ({
          ...doc,
          createdAt:
            doc.createdAt instanceof Timestamp
              ? doc.createdAt.toDate()
              : new Date(doc.createdAt),
        }));
      })
    );
  }
}
