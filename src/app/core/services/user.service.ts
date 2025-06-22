import { inject, Injectable } from '@angular/core';
import { User as AfUser, Auth } from '@angular/fire/auth';
import {
  collection,
  Firestore,
  doc,
  docData,
  setDoc,
  getDoc,
} from '@angular/fire/firestore';
import { from, map, Observable, of, switchMap, forkJoin } from 'rxjs';
import { User } from '../models/interfaces';

@Injectable({
  providedIn: 'root',
})
export class UserService {
  private afStore = inject(Firestore);
  private afAuth = inject(Auth);

  private usersCollection = collection(this.afStore, 'users');

  /**
   * Get user profile and create user profile if it does not exist
   * @param afUser - User
   */
  public createUserProfile(afUser: AfUser | null): Observable<User> {
    if (!afUser) {
      const user: User = {
        uid: '',
        name: '',
        email: '',
        gender: 'prefer-not-to-say',
        age: 0,
        height: 0,
        currentWeight: 0,
        goalWeight: 0,
        unitSystem: 'imperial',
        checkInDay: 'Monday',
        goalPlan: 'slow',
        calorieTarget: 0,
        createdAt: new Date().toISOString(),
      };
      return of(user);
    }

    const userDoc = doc(this.usersCollection, afUser.uid);
    const user$ = docData(userDoc) as Observable<User>;

    return user$.pipe(
      switchMap((user) => {
        if (!user) {
          const userProfile: User = {
            uid: afUser.uid,
            name: afUser.displayName || '',
            email: afUser.email || '',
            gender: 'prefer-not-to-say',
            age: 0,
            height: 0,
            currentWeight: 0,
            goalWeight: 0,
            unitSystem: 'imperial',
            checkInDay: 'Monday',
            goalPlan: 'slow',
            calorieTarget: 0,
            createdAt: new Date().toISOString(),
          };

          // Create user profile
          setDoc(userDoc, userProfile);

          return from(setDoc(userDoc, userProfile)).pipe(
            map(() => userProfile)
          );
        }
        return of(user);
      })
    );
  }

  /**
   * Get user profile
   * @param userId - string
   * @returns - User
   */
  public getUserProfile(): Observable<User> {
    const currentUser = this.afAuth.currentUser;

    return this.createUserProfile(currentUser);
  }

  /**
   * Get user profile by user id
   * @param userId - string
   * @returns - User
   */
  public getUserProfileById(userId: string): Observable<User> {
    const userDoc = doc(this.usersCollection, userId);
    const user$ = from(getDoc(userDoc)).pipe(map((doc) => doc.data() as User));

    return user$;
  }

  /**
   * Get multiple users by their IDs
   * @param userIds - string[]
   * @returns - User[]
   */
  public getUsersByIds(userIds: string[]): Observable<User[]> {
    const userDocs = userIds.map((id) => this.getUserProfileById(id));
    return forkJoin(userDocs);
  }
}
