import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { isPossible, generateCurrentAcademicYear } from '@/utils/academicYear';

describe('isPossible', () => {
  it('should return true when startDate is before endDate', () => {
    const startDate = '2022-01-01';
    const endDate = '2022-12-31';
    const result = isPossible(startDate, endDate);
    expect(result).toBe(true);
  });

  it('should return false when startDate is after endDate', () => {
    const startDate = '2022-12-31';
    const endDate = '2022-01-01';
    const result = isPossible(startDate, endDate);
    expect(result).toBe(false);
  });

  it('should return false when startDate is equal to endDate', () => {
    const startDate = '2022-01-01';
    const endDate = '2022-01-01';
    const result = isPossible(startDate, endDate);
    expect(result).toBe(false);
  });

  it('should return false when startDate is before year 2000', () => {
    const startDate = '1999-12-31';
    const endDate = '2022-12-31';
    const result = isPossible(startDate, endDate);
    expect(result).toBe(false);
  });

  it('should return false when startDate is after year 2100', () => {
    const startDate = '2101-01-01';
    const endDate = '2150-12-31';
    const result = isPossible(startDate, endDate);
    expect(result).toBe(false);
  });
});

describe('generateCurrentAcademicYear', () => {
  beforeEach(() => {
    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it('should return the current academic year when the current month is after July', () => {
    const now = new Date(2022, 8, 1);
    vi.setSystemTime(now);
    const result = generateCurrentAcademicYear();
    expect(result).toEqual({
      startDate: new Date(2022, 0, 1),
      endDate: new Date(2023, 0, 1),
      name: '2022-2023',
    });
  });

  it('should return the previous academic year when the current month is before July', () => {
    const now = new Date(2022, 5, 1);
    vi.setSystemTime(now);
    const result = generateCurrentAcademicYear();
    expect(result).toEqual({
      startDate: new Date(2021, 0, 1),
      endDate: new Date(2022, 0, 1),
      name: '2021-2022',
    });
  });
});
