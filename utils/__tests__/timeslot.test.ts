import { describe, it, expect } from 'vitest';
import { isValidTime, isValidTimeRange } from '@/utils/timeslot';

describe('isValidTime', () => {
  it('should return true for valid time', () => {
    expect(isValidTime('00:00')).toBe(true);
    expect(isValidTime('23:59')).toBe(true);
    expect(isValidTime('12:34')).toBe(true);
  });

  it('should return false for invalid time', () => {
    expect(isValidTime('24:00')).toBe(false);
    expect(isValidTime('00:60')).toBe(false);
    expect(isValidTime('25:00')).toBe(false);
    expect(isValidTime('00:61')).toBe(false);
    expect(isValidTime('invalid')).toBe(false);
  });
});

describe('isValidTimeRange', () => {
  it('should return true for valid time range', () => {
    expect(isValidTimeRange('00:00', '23:59')).toBe(true);
    expect(isValidTimeRange('12:00', '13:00')).toBe(true);
  });

  it('should return false for invalid time range', () => {
    expect(isValidTimeRange('23:59', '00:00')).toBe(false);
    expect(isValidTimeRange('13:00', '12:00')).toBe(false);
  });
});
