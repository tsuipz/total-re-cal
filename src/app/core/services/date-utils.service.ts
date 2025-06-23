import { Injectable } from '@angular/core';
import { Timestamp } from '@angular/fire/firestore';
import {
  startOfDay,
  endOfDay,
  isSameDay,
  isWithinInterval,
  format,
  parseISO,
  isValid,
  addDays,
  subDays,
  startOfWeek,
  endOfWeek,
  startOfMonth,
  endOfMonth,
} from 'date-fns';

@Injectable({
  providedIn: 'root',
})
export class DateUtilsService {
  /**
   * Get start of today as a Firestore Timestamp
   * @returns Timestamp representing start of today
   */
  getStartOfTodayTimestamp(): Timestamp {
    const today = new Date();
    const startOfTodayDate = startOfDay(today);
    return Timestamp.fromDate(startOfTodayDate);
  }

  /**
   * Get end of today as a Firestore Timestamp
   * @returns Timestamp representing end of today
   */
  getEndOfTodayTimestamp(): Timestamp {
    const today = new Date();
    const endOfTodayDate = endOfDay(today);
    return Timestamp.fromDate(endOfTodayDate);
  }

  /**
   * Check if two dates are the same day
   * @param date1 - First date
   * @param date2 - Second date
   * @returns true if dates are the same day
   */
  isSameDay(date1: Date, date2: Date): boolean {
    return isSameDay(date1, date2);
  }

  /**
   * Check if a date is today
   * @param date - Date to check
   * @returns true if date is today
   */
  isToday(date: Date): boolean {
    return isSameDay(date, new Date());
  }

  /**
   * Check if a date is within a date range (inclusive)
   * @param date - Date to check
   * @param startDate - Start of range
   * @param endDate - End of range
   * @returns true if date is within range
   */
  isWithinDateRange(date: Date, startDate: Date, endDate: Date): boolean {
    const start = startOfDay(startDate);
    const end = endOfDay(endDate);
    const interval = { start, end };
    return isWithinInterval(date, interval);
  }

  /**
   * Format a date to a readable string
   * @param date - Date to format
   * @param formatString - Format string (default: 'MMM dd, yyyy')
   * @returns Formatted date string
   */
  formatDate(date: Date, formatString = 'MMM dd, yyyy'): string {
    return format(date, formatString);
  }

  /**
   * Parse a date string safely
   * @param dateString - Date string to parse
   * @returns Parsed date or null if invalid
   */
  parseDate(dateString: string): Date | null {
    const parsed = parseISO(dateString);
    return isValid(parsed) ? parsed : null;
  }

  /**
   * Get date range for a specific day
   * @param date - Date to get range for
   * @returns Object with start and end timestamps
   */
  getDayRange(date: Date): { start: Timestamp; end: Timestamp } {
    return {
      start: Timestamp.fromDate(startOfDay(date)),
      end: Timestamp.fromDate(endOfDay(date)),
    };
  }

  /**
   * Get date range for current week
   * @returns Object with start and end timestamps
   */
  getWeekRange(): { start: Timestamp; end: Timestamp } {
    const today = new Date();
    return {
      start: Timestamp.fromDate(startOfWeek(today)),
      end: Timestamp.fromDate(endOfWeek(today)),
    };
  }

  /**
   * Get date range for current month
   * @returns Object with start and end timestamps
   */
  getMonthRange(): { start: Timestamp; end: Timestamp } {
    const today = new Date();
    return {
      start: Timestamp.fromDate(startOfMonth(today)),
      end: Timestamp.fromDate(endOfMonth(today)),
    };
  }

  /**
   * Get a date relative to today
   * @param days - Number of days to add/subtract
   * @returns Date relative to today
   */
  getRelativeDate(days: number): Date {
    const today = new Date();
    return days >= 0 ? addDays(today, days) : subDays(today, Math.abs(days));
  }
}
