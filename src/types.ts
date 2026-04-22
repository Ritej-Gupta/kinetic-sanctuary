export type HabitCategory = 
  | 'Physical Health' 
  | 'Mental Clarity' 
  | 'Productivity' 
  | 'Learning' 
  | 'Wellness' 
  | 'Personal Growth' 
  | 'Activity' 
  | 'Financial' 
  | 'Household' 
  | 'Social'
  | 'Other';

export interface HabitData {
  id: string;
  name: string;
  category: HabitCategory;
  weeklyTarget: number;
  dailyTarget?: number; // Numeric goal (e.g., 8)
  unit?: string;        // Unit (e.g., "glasses")
  stackedOnId?: string; // Habit Stacking reference
  createdAt: string;
}

export interface HabitEntry {
  habitId: string;
  date: string; // YYYY-MM-DD
  completed: boolean;
  value?: number; // Optional text/number if we want to track amounts later (like 5000 steps)
}

export interface DayData {
  date: string;
  count: number; // total completed habits that day
}
