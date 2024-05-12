import { describe, it, expect } from 'vitest';
import { isPossible } from '@/utils/academicYear';

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
