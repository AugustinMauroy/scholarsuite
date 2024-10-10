import { describe, it, expect } from 'vitest';
import { isNodeError } from '../node';

describe('isNodeError', () => {
  it('returns true when error is an object with a string code property', () => {
    const error = { code: 'ENOENT' };
    expect(isNodeError(error)).toBe(true);
  });

  it('returns false when error is an object without a code property', () => {
    const error = { message: 'An error occurred' };
    expect(isNodeError(error)).toBe(false);
  });

  it('returns false when error is an object with a non-string code property', () => {
    const error = { code: 404 };
    expect(isNodeError(error)).toBe(false);
  });

  it('returns false when error is null', () => {
    const error = null;
    expect(isNodeError(error)).toBe(false);
  });

  it('returns false when error is undefined', () => {
    const error = undefined;
    expect(isNodeError(error)).toBe(false);
  });

  it('returns false when error is a string', () => {
    const error = 'error';
    expect(isNodeError(error)).toBe(false);
  });

  it('returns false when error is a number', () => {
    const error = 123;
    expect(isNodeError(error)).toBe(false);
  });
});
