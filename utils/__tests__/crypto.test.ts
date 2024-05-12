import { expect, test } from 'vitest';
import { encode, decode } from '@/utils/crypto';

test('encode and decode password', async () => {
  const password = 'mysecretpassword';
  const encoded = await encode(password);
  expect(encoded).toBeDefined();
  const decoded = await decode(encoded);
  expect(decoded).toBeDefined();
});
