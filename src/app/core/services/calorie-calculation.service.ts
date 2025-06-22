import { Injectable } from '@angular/core';
import { Gender } from '@models/types';

export interface CalorieCalculationData {
  gender: Gender;
  age: number;
  heightCm: number;
  currentWeightKg: number;
}

@Injectable({
  providedIn: 'root',
})
export class CalorieCalculationService {
  private readonly SEDENTARY_MULTIPLIER = 1.2;
  private readonly CALORIES_PER_POUND = 3500;
  private readonly DAYS_IN_WEEK = 7;

  public calculateDailyCalorieTarget(
    data: CalorieCalculationData,
    weeklyLossLbs: number
  ): number {
    const bmr = this.calculateBMR(data);
    const maintenanceCalories = bmr * this.SEDENTARY_MULTIPLIER;
    const dailyDeficit =
      (weeklyLossLbs * this.CALORIES_PER_POUND) / this.DAYS_IN_WEEK;

    return Math.round(maintenanceCalories - dailyDeficit);
  }

  private calculateBMR(data: CalorieCalculationData): number {
    const { gender, age, heightCm, currentWeightKg } = data;
    const weightFactor = 10 * currentWeightKg;
    const heightFactor = 6.25 * heightCm;
    const ageFactor = 5 * age;

    switch (gender) {
      case 'male':
        return weightFactor + heightFactor - ageFactor + 5;
      case 'female':
        return weightFactor + heightFactor - ageFactor - 161;
      default:
        // Average for non-binary/prefer-not-to-say
        return weightFactor + heightFactor - ageFactor - 78;
    }
  }
}
