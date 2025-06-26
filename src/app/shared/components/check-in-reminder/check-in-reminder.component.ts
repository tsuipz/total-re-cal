import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { Store } from '@ngrx/store';
import { Observable, combineLatest } from 'rxjs';
import { take } from 'rxjs/operators';
import { CheckInReminderNotification } from '@app/core/models/interfaces';
import {
  NotificationsActions,
  NotificationsSelectors,
} from '@app/core/stores/notifications';
import { WeightCheckInDialogComponent } from '../weight-check-in-dialog/weight-check-in-dialog.component';
import { AuthSelectors } from '@app/core/stores/auth';

@Component({
  selector: 'app-check-in-reminder',
  templateUrl: './check-in-reminder.component.html',
  styleUrls: ['./check-in-reminder.component.scss'],
  imports: [
    CommonModule,
    MatCardModule,
    MatButtonModule,
    MatIconModule,
    MatDialogModule,
  ],
  standalone: true,
})
export class CheckInReminderComponent {
  private store = inject(Store);
  private dialog = inject(MatDialog);

  public checkInReminder$: Observable<CheckInReminderNotification | null> =
    this.store.select(NotificationsSelectors.selectCheckInReminderNotification);

  public isLoading$: Observable<boolean> = this.store.select(
    NotificationsSelectors.selectNotificationsIsLoading
  );

  public onCheckIn(): void {
    combineLatest([
      this.store.select(AuthSelectors.selectCurrentUser),
      this.checkInReminder$,
    ])
      .pipe(take(1))
      .subscribe(([user, reminder]) => {
        if (user && reminder) {
          const dialogRef = this.dialog.open(WeightCheckInDialogComponent, {
            data: {
              userId: user.uid,
              unitSystem: user.unitSystem,
            },
            disableClose: true,
          });

          dialogRef.afterClosed().subscribe((result) => {
            if (result) {
              // Mark the notification as completed
              this.store.dispatch(
                NotificationsActions.markNotificationCompleted({
                  notificationId: reminder.id,
                })
              );
            }
          });
        }
      });
  }

  public onDismiss(): void {
    this.checkInReminder$.pipe(take(1)).subscribe((reminder) => {
      if (reminder) {
        this.store.dispatch(
          NotificationsActions.dismissNotification({
            notificationId: reminder.id,
          })
        );
      }
    });
  }
}
