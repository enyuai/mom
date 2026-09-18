export type Role = 'PATIENT' | 'DOCTOR';

export interface User {
  id: string;
  name: string;
  role: Role;
  surgeryDate?: string;
  dietPhase?: string;
  postOpDay?: number;
}

export type WaterStatus = 'CAN_DRINK' | 'NO_WATER_PRE_MEAL' | 'NO_WATER_POST_MEAL';

export interface MealPlan {
  id: string;
  mealIndex: number;
  mealName: string;
  scheduledTime: string; // HH:mm
  items: { name: string; weight: number }[];
  status: 'PENDING' | 'COMPLETED' | 'SKIPPED';
  completedAt?: Date;
}

export interface PatientVitals {
  date: string;
  weight: number;
}
