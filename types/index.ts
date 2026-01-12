// Core Type Definitions for ClockPlan

export type CategoryType = 'work' | 'personal' | 'exercise' | 'study' | 'meeting';

export interface Category {
  id: CategoryType;
  name: string;
  color: string;
  icon: string;
}

export interface Schedule {
  id: string;
  title: string;
  startTime: string; // "HH:mm" format
  endTime: string;   // "HH:mm" format
  category: CategoryType;
  color: string;
  notificationEnabled: boolean;
  notificationId?: string;
  createdAt: string; // ISO 8601
  updatedAt: string; // ISO 8601
}

export interface ScheduleInput {
  title: string;
  startTime: string;
  endTime: string;
  category: CategoryType;
  color: string;
  notificationEnabled: boolean;
}

export interface ClockConfig {
  RADIUS: number;
  STROKE_WIDTH: number;
  CENTER_RADIUS: number;
  HOUR_MARK_LENGTH: number;
  TOTAL_HOURS: number;
  ANIMATION_DURATION: number;
}

export interface StorageKeys {
  SCHEDULES: string;
  SETTINGS: string;
}
