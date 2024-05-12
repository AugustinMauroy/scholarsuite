import { expect, test } from 'vitest';
import { getAcronymFromString } from '@/utils/string';

test('getAcronymFromString', () => {
  expect(getAcronymFromString('')).toEqual('NA');
  expect(getAcronymFromString(' ')).toEqual('NA');
  expect(getAcronymFromString('John Doe')).toEqual('JD');
  expect(getAcronymFromString('John Doe Smith')).toEqual('JDS');
});
