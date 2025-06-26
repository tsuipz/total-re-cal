import { Injectable, inject } from '@angular/core';
import {
  Firestore,
  collection,
  collectionData,
  query,
  where,
  orderBy,
  addDoc,
  doc,
  updateDoc,
} from '@angular/fire/firestore';
import { Observable, map, switchMap, from, forkJoin } from 'rxjs';
import { User, WeightCheckIn } from '../models/interfaces';
import { UserService } from './user.service';

@Injectable({
  providedIn: 'root',
})
export class WeightService {
  private firestore = inject(Firestore);
  private userService = inject(UserService);
  private weightCheckInsCollection = collection(
    this.firestore,
    'weightCheckIns'
  );

  /**
   * Log a weight check-in for the current user
   * @param weight - The weight value
   * @returns Observable that completes when the check-in is saved
   */
  public logWeightCheckIn(weight: number): Observable<User> {
    return this.userService.getUserProfile().pipe(
      switchMap((currentUser) => {
        currentUser.currentWeight = weight;

        if (!currentUser) {
          throw new Error('No authenticated user found');
        }

        const weightCheckIn: Omit<WeightCheckIn, 'id'> = {
          userId: currentUser.uid,
          weight,
          date: new Date().toISOString(),
        };

        // Add the weight check-in to Firestore
        const addCheckIn$ = from(
          addDoc(this.weightCheckInsCollection, weightCheckIn)
        );

        // Update the user's current weight in their profile
        const userDoc = doc(this.firestore, 'users', currentUser.uid);
        const updateUser$ = from(
          updateDoc(userDoc, {
            currentWeight: weight,
          })
        );

        // Combine both operations
        return forkJoin([addCheckIn$, updateUser$]).pipe(
          map(() => currentUser)
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
      orderBy('date', 'desc')
    );

    return collectionData(weightQuery, { idField: 'id' }).pipe(
      map((docs) => {
        return (docs as WeightCheckIn[]).map((doc) => ({
          id: doc.id,
          userId: doc.userId,
          weight: doc.weight,
          date: doc.date,
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
      switchMap((user) => {
        if (!user) {
          throw new Error('No authenticated user found');
        }
        return this.getWeightHistory(user.uid);
      })
    );
  }
}
