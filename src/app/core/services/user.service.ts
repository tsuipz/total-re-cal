import { inject, Injectable } from '@angular/core';
import { User as AfUser, Auth } from '@angular/fire/auth';
import {
  collection,
  Firestore,
  doc,
  docData,
  getDoc,
  setDoc,
} from '@angular/fire/firestore';
import { from, map, Observable, of, switchMap, forkJoin, take } from 'rxjs';
import { User } from '../models/interfaces';
import { HttpErrorResponse } from '@angular/common/http';

@Injectable({
  providedIn: 'root',
})
export class UserService {
  private afStore = inject(Firestore);
  private afAuth = inject(Auth);

  private usersCollection = collection(this.afStore, 'users');

  /**
   * Create and save user profile to Firestore
   * @param userProfile - User profile data
   * @returns - Observable of the created user
   */
  public saveUserProfile(userProfile: User): Observable<User> {
    const currentUser = this.afAuth.currentUser;

    if (!currentUser) {
      throw new HttpErrorResponse({
        error: {
          message: 'No authenticated user found',
        },
        status: 500,
        statusText: 'No authenticated user found',
      });
    }

    const userDoc = doc(this.usersCollection, currentUser.uid);
    const user$ = docData(userDoc) as Observable<User>;

    return user$.pipe(
      take(1),
      switchMap((user) => {
        // check if the user already exists
        if (user) {
          throw new HttpErrorResponse({
            error: {
              message: 'User already exists',
            },
            status: 500,
            statusText: 'User already exists',
          });
        }

        // Create complete user profile with proper uid and email
        const completeUserProfile: User = {
          ...userProfile,
          uid: currentUser.uid,
          email: currentUser.email || '',
          createdAt: new Date(),
        };

        // Save complete user profile to Firestore
        return from(setDoc(userDoc, completeUserProfile)).pipe(
          map(() => completeUserProfile)
        );
      })
    );
  }

  /**
   * Get user profile and create user profile if it does not exist
   * @param afUser - User
   */
  public createUserProfile(afUser: AfUser | null): Observable<User> {
    if (!afUser) {
      throw new Error('User not found');
    }

    const userDoc = doc(this.usersCollection, afUser.uid);
    const user$ = docData(userDoc) as Observable<User>;

    return user$.pipe(
      switchMap((user) => {
        if (!user) {
          throw new Error('User not found');
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
