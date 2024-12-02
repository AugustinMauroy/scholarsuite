import { defineRouting } from 'next-intl/routing';
import { availableLocaleCodes, defaultLocale } from './config.ts';

export const routing = defineRouting({
  locales: availableLocaleCodes,
  defaultLocale: defaultLocale.code,
});
