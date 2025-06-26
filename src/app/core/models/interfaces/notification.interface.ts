export interface Notification {
  id: string;
  userId: string;
  type: 'check-in-reminder' | 'weight-goal' | 'calorie-goal' | 'general';
  title: string;
  message: string;
  dateShown: Date;
  completed: boolean;
  dismissed: boolean;
  createdAt: Date;
  expiresAt?: Date;
}

export interface CheckInReminderNotification extends Notification {
  type: 'check-in-reminder';
  checkInDay: string;
  lastCheckInDate?: Date;
}
