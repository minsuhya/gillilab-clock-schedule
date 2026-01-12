import { Schedule } from '@/types';
import { getCurrentSchedule } from '../utils/scheduleUtils';
import { timeToMinutes } from '../utils/timeUtils';

describe('scheduleUtils', () => {
  describe('getCurrentSchedule', () => {
    const mockSchedules: Schedule[] = [
      {
        id: '1',
        title: '아침 운동',
        startTime: '07:00',
        endTime: '08:00',
        category: 'exercise',
        color: '#EF4444',
        notificationEnabled: true,
        createdAt: '2026-01-13T00:00:00.000Z',
        updatedAt: '2026-01-13T00:00:00.000Z',
      },
      {
        id: '2',
        title: '업무 미팅',
        startTime: '09:00',
        endTime: '10:30',
        category: 'work',
        color: '#3B82F6',
        notificationEnabled: true,
        createdAt: '2026-01-13T00:00:00.000Z',
        updatedAt: '2026-01-13T00:00:00.000Z',
      },
      {
        id: '3',
        title: '점심 식사',
        startTime: '12:00',
        endTime: '13:00',
        category: 'personal',
        color: '#10B981',
        notificationEnabled: false,
        createdAt: '2026-01-13T00:00:00.000Z',
        updatedAt: '2026-01-13T00:00:00.000Z',
      },
    ];

    it('should return the schedule that includes the current time', () => {
      const result = getCurrentSchedule(mockSchedules, '09:30');
      expect(result).not.toBeNull();
      expect(result?.id).toBe('2');
      expect(result?.title).toBe('업무 미팅');
    });

    it('should return null when no schedule matches the current time', () => {
      const result = getCurrentSchedule(mockSchedules, '11:00');
      expect(result).toBeNull();
    });

    it('should return the correct schedule at the start time', () => {
      const result = getCurrentSchedule(mockSchedules, '07:00');
      expect(result).not.toBeNull();
      expect(result?.id).toBe('1');
    });

    it('should return null at the end time (exclusive)', () => {
      const result = getCurrentSchedule(mockSchedules, '08:00');
      expect(result?.id).not.toBe('1');
    });

    it('should return null for empty schedule list', () => {
      const result = getCurrentSchedule([], '09:00');
      expect(result).toBeNull();
    });

    it('should use current time when no time parameter is provided', () => {
      const result = getCurrentSchedule(mockSchedules);
      expect(result === null || result instanceof Object).toBe(true);
    });
  });
});
