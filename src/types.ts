export interface Profile {
  quitDate: string; // ISO timestamp of the quit moment
  cigsPerDay: number;
  cigsPerPack: number;
  pricePerPack: number;
  currency: string;
}

export type CravingOutcome = 'resisted' | 'slipped';

export interface CravingEvent {
  id: string;
  at: string; // ISO timestamp
  outcome: CravingOutcome;
  trigger: string | null;
  intensity: number; // 1..5
  note?: string;
}

export interface AppData {
  profile: Profile | null;
  cravings: CravingEvent[];
}

export const TRIGGERS = [
  'Coffee',
  'Stress',
  'After a meal',
  'Alcohol',
  'Driving',
  'Work break',
  'Social',
  'Boredom',
  'Phone / scrolling',
  'Other',
] as const;
