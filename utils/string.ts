export const getAcronymFromString = (str: string) =>
  [...(str.trim().match(/\b(\w)/g) || 'NA')].join('').toUpperCase();
