import {
  timeToAngle,
  angleToTime,
  timeToMinutes,
  minutesToTime,
  getCurrentTime,
  isValidTime,
  isEndTimeValid,
} from '../utils/timeUtils';

describe('timeUtils', () => {
  describe('timeToAngle', () => {
    it('should convert 00:00 to -90 degrees', () => {
      expect(timeToAngle('00:00')).toBe(-90);
    });

    it('should convert 06:00 to 0 degrees', () => {
      expect(timeToAngle('06:00')).toBe(0);
    });

    it('should convert 12:00 to 90 degrees', () => {
      expect(timeToAngle('12:00')).toBe(90);
    });

    it('should convert 18:00 to 180 degrees', () => {
      expect(timeToAngle('18:00')).toBe(180);
    });

    it('should convert 23:59 to close to 270 degrees', () => {
      expect(timeToAngle('23:59')).toBeCloseTo(269.75, 1);
    });
  });

  describe('angleToTime', () => {
    it('should convert -90 degrees to 00:00', () => {
      expect(angleToTime(-90)).toBe('00:00');
    });

    it('should convert 0 degrees to 06:00', () => {
      expect(angleToTime(0)).toBe('06:00');
    });

    it('should convert 90 degrees to 12:00', () => {
      expect(angleToTime(90)).toBe('12:00');
    });

    it('should convert 180 degrees to 18:00', () => {
      expect(angleToTime(180)).toBe('18:00');
    });
  });

  describe('timeToMinutes', () => {
    it('should convert 00:00 to 0 minutes', () => {
      expect(timeToMinutes('00:00')).toBe(0);
    });

    it('should convert 09:30 to 570 minutes', () => {
      expect(timeToMinutes('09:30')).toBe(570);
    });

    it('should convert 23:59 to 1439 minutes', () => {
      expect(timeToMinutes('23:59')).toBe(1439);
    });
  });

  describe('minutesToTime', () => {
    it('should convert 0 minutes to 00:00', () => {
      expect(minutesToTime(0)).toBe('00:00');
    });

    it('should convert 570 minutes to 09:30', () => {
      expect(minutesToTime(570)).toBe('09:30');
    });

    it('should convert 1439 minutes to 23:59', () => {
      expect(minutesToTime(1439)).toBe('23:59');
    });
  });

  describe('isValidTime', () => {
    it('should return true for valid time formats', () => {
      expect(isValidTime('00:00')).toBe(true);
      expect(isValidTime('12:30')).toBe(true);
      expect(isValidTime('23:59')).toBe(true);
    });

    it('should return false for invalid time formats', () => {
      expect(isValidTime('24:00')).toBe(false);
      expect(isValidTime('12:60')).toBe(false);
      expect(isValidTime('1:30')).toBe(false);
      expect(isValidTime('12-30')).toBe(false);
    });
  });

  describe('isEndTimeValid', () => {
    it('should return true when end time is after start time', () => {
      expect(isEndTimeValid('09:00', '10:00')).toBe(true);
      expect(isEndTimeValid('09:00', '09:01')).toBe(true);
    });

    it('should return false when end time is before or equal to start time', () => {
      expect(isEndTimeValid('10:00', '09:00')).toBe(false);
      expect(isEndTimeValid('10:00', '10:00')).toBe(false);
    });
  });

  describe('getCurrentTime', () => {
    it('should return current time in HH:MM:SS format', () => {
      const time = getCurrentTime();
      expect(time).toMatch(/^\d{2}:\d{2}:\d{2}$/);
    });

    it('should return a time value that matches current time', () => {
      const time1 = getCurrentTime();
      const now = new Date();
      const expectedHours = now.getHours().toString().padStart(2, '0');
      const expectedMinutes = now.getMinutes().toString().padStart(2, '0');
      const expectedSeconds = now.getSeconds().toString().padStart(2, '0');
      const expectedTime = `${expectedHours}:${expectedMinutes}:${expectedSeconds}`;
      
      expect(time1).toBe(expectedTime);
    });

    it('should return valid hours (00-23), minutes (00-59), and seconds (00-59)', () => {
      const time = getCurrentTime();
      const [hours, minutes, seconds] = time.split(':').map(Number);
      
      expect(hours).toBeGreaterThanOrEqual(0);
      expect(hours).toBeLessThan(24);
      expect(minutes).toBeGreaterThanOrEqual(0);
      expect(minutes).toBeLessThan(60);
      expect(seconds).toBeGreaterThanOrEqual(0);
      expect(seconds).toBeLessThan(60);
    });

    it('should handle HH:MM:SS format in timeToMinutes', () => {
      expect(timeToMinutes('09:30:45')).toBe(570);
      expect(timeToMinutes('09:30:00')).toBe(570);
      expect(timeToMinutes('23:59:59')).toBe(1439);
    });
  });
});
