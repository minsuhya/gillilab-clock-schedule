import { Schedule } from '@/types';
import { timeToMinutes } from './timeUtils';

export function hasOverlap(newSchedule: Schedule, existingSchedules: Schedule[]): boolean {
  return existingSchedules.some(schedule => {
    if (schedule.id === newSchedule.id) return false;
    
    const newStart = timeToMinutes(newSchedule.startTime);
    const newEnd = timeToMinutes(newSchedule.endTime);
    const existStart = timeToMinutes(schedule.startTime);
    const existEnd = timeToMinutes(schedule.endTime);
    
    return (newStart < existEnd && newEnd > existStart);
  });
}

export function sortSchedulesByTime(schedules: Schedule[]): Schedule[] {
  return [...schedules].sort((a, b) => {
    const aMinutes = timeToMinutes(a.startTime);
    const bMinutes = timeToMinutes(b.startTime);
    return aMinutes - bMinutes;
  });
}

export function getCurrentSchedule(schedules: Schedule[], currentTime?: string): Schedule | null {
  const now = currentTime || new Date().toTimeString().slice(0, 5);
  const currentMinutes = timeToMinutes(now);
  
  return schedules.find(schedule => {
    const startMinutes = timeToMinutes(schedule.startTime);
    const endMinutes = timeToMinutes(schedule.endTime);
    return currentMinutes >= startMinutes && currentMinutes < endMinutes;
  }) || null;
}
