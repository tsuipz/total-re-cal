import { Injectable, inject } from '@angular/core';
import {
  Firestore,
  collection,
  collectionData,
  query,
  where,
  orderBy,
  addDoc,
  updateDoc,
  doc,
  Timestamp,
} from '@angular/fire/firestore';
import { Observable, map, switchMap, from, of } from 'rxjs';
import {
  Notification,
  CheckInReminderNotification,
} from '../models/interfaces';
import { UserService } from './user.service';
import { DateUtilsService } from './date-utils.service';
import { WeightService } from './weight.service';
import { CheckInDay } from '../models/types';

@Injectable({
  providedIn: 'root',
})
export class NotificationService {
  private firestore = inject(Firestore);
  private userService = inject(UserService);
  private dateUtils = inject(DateUtilsService);
  private weightService = inject(WeightService);
  private notificationsCollection = collection(this.firestore, 'notifications');

  /**
   * Check if user needs a check-in reminder
   * @param userId - The user ID
   * @returns Observable that emits true if check-in is due
   */
  public shouldShowCheckInReminder(userId: string): Observable<boolean> {
    return this.userService.getUserProfileById(userId).pipe(
      switchMap((user) => {
        if (!user.checkInDay) {
          return of(false);
        }

        return this.isCheckInDay(user.checkInDay).pipe(
          switchMap((isCheckInDay) => {
            if (!isCheckInDay) {
              return of(false);
            }

            return this.hasCheckedInThisWeek(userId).pipe(
              map((hasCheckedIn) => !hasCheckedIn)
            );
          })
        );
      })
    );
  }

  /**
   * Check if today is the user's check-in day
   * @param checkInDay - The user's preferred check-in day
   * @returns Observable that emits true if today is check-in day
   */
  private isCheckInDay(checkInDay: CheckInDay): Observable<boolean> {
    const today = new Date();
    const dayNames = [
      'Sunday',
      'Monday',
      'Tuesday',
      'Wednesday',
      'Thursday',
      'Friday',
      'Saturday',
    ];
    const todayName = dayNames[today.getDay()];

    return of(todayName === checkInDay);
  }

  /**
   * Check if user has already checked in this week
   * @param userId - The user ID
   * @returns Observable that emits true if user has checked in this week
   */
  private hasCheckedInThisWeek(userId: string): Observable<boolean> {
    const weekRange = this.dateUtils.getWeekRange();

    return this.weightService.getWeightHistory(userId).pipe(
      map((checkIns) => {
        return checkIns.some((checkIn) => {
          const checkInDate =
            checkIn.createdAt instanceof Timestamp
              ? checkIn.createdAt.toDate()
              : checkIn.createdAt;

          return this.dateUtils.isWithinDateRange(
            checkInDate,
            weekRange.start.toDate(),
            weekRange.end.toDate()
          );
        });
      })
    );
  }

  /**
   * Create a check-in reminder notification
   * @param userId - The user ID
   * @returns Observable of the created notification
   */
  public createCheckInReminder(
    userId: string
  ): Observable<CheckInReminderNotification> {
    return this.userService.getUserProfileById(userId).pipe(
      switchMap((user) => {
        const notification: Omit<CheckInReminderNotification, 'id'> = {
          userId,
          type: 'check-in-reminder',
          title: 'Weekly Weight Check-in',
          message: `It's time for your weekly weight check-in! This helps you stay accountable and track your progress.`,
          dateShown: new Date(),
          completed: false,
          dismissed: false,
          createdAt: new Date(),
          checkInDay: user.checkInDay,
          expiresAt: this.dateUtils.getEndOfDay(new Date()).toDate(),
        };

        return from(addDoc(this.notificationsCollection, notification)).pipe(
          map((docRef) => ({
            ...notification,
            id: docRef.id,
          }))
        );
      })
    );
  }

  /**
   * Get active notifications for a user
   * @param userId - The user ID
   * @returns Observable of active notifications
   */
  public getActiveNotifications(userId: string): Observable<Notification[]> {
    const notificationsQuery = query(
      this.notificationsCollection,
      where('userId', '==', userId),
      where('completed', '==', false),
      where('dismissed', '==', false),
      orderBy('createdAt', 'desc')
    );

    return collectionData(notificationsQuery, { idField: 'id' }).pipe(
      map((docs) => {
        return (docs as Notification[]).map((doc) => ({
          ...doc,
          dateShown:
            doc.dateShown instanceof Timestamp
              ? doc.dateShown.toDate()
              : doc.dateShown,
          createdAt:
            doc.createdAt instanceof Timestamp
              ? doc.createdAt.toDate()
              : doc.createdAt,
          expiresAt:
            doc.expiresAt instanceof Timestamp
              ? doc.expiresAt.toDate()
              : doc.expiresAt,
        }));
      })
    );
  }

  /**
   * Mark a notification as completed
   * @param notificationId - The notification ID
   * @returns Observable that completes when the notification is updated
   */
  public markNotificationCompleted(notificationId: string): Observable<void> {
    const notificationDoc = doc(this.notificationsCollection, notificationId);
    return from(updateDoc(notificationDoc, { completed: true }));
  }

  /**
   * Mark a notification as dismissed
   * @param notificationId - The notification ID
   * @returns Observable that completes when the notification is updated
   */
  public dismissNotification(notificationId: string): Observable<void> {
    const notificationDoc = doc(this.notificationsCollection, notificationId);
    return from(updateDoc(notificationDoc, { dismissed: true }));
  }

  /**
   * Check for and create check-in reminder if needed
   * @param userId - The user ID
   * @returns Observable that emits the notification if created, or null if not needed
   */
  public checkAndCreateCheckInReminder(
    userId: string
  ): Observable<CheckInReminderNotification | null> {
    return this.shouldShowCheckInReminder(userId).pipe(
      switchMap((shouldShow) => {
        if (shouldShow) {
          return this.createCheckInReminder(userId);
        }
        return of(null);
      })
    );
  }
}
