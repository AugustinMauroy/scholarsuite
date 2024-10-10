import { expect, describe, it } from 'vitest';
import { encode } from '@/utils/crypto';

describe('encode  password', async () => {
  /*const password = 'mysecretpassword';
  const encoded = await encode(password);
  expect(encoded).toBeDefined();
  const encoded2 = await encode(password);
  expect(encoded).toEqual(encoded2);
  const encoded3 = await encode('anotherpassword');
  expect(encoded).not.toEqual(encoded3);*/

  const password = 'mysecretpassword';
  const password2 = 'anotherpassword';

  it('should return the same hash for the same password', async () => {
    const encoded = await encode(password);
    const encoded2 = await encode(password);
    expect(encoded).toEqual(encoded2);
  });

  it('should return different hashes for different passwords', async () => {
    const encoded = await encode(password);
    const encoded2 = await encode(password2);
    expect(encoded).not.toEqual(encoded2);
  });

  it('should return a hash', async () => {
    const encoded = await encode(password);
    expect(encoded).toBeDefined();
  });
});
