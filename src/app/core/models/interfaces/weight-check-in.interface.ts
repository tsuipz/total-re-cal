export interface WeightCheckIn {
  id: string;
  userId: string;
  weight: number; // in lbs or kg depending on user's unit system
  createdAt: Date;
}
