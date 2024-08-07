import { readFile } from 'node:fs/promises';

export const getPackage = async () => {
  const packageJson = await readFile('./package.json', 'utf-8');

  return JSON.parse(packageJson);
};
