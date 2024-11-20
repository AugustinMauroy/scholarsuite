import localeConfig from '@/i18n/config.json' with { type: 'json' };

// As set of available and enabled locales for the website
// This is used for allowing us to redirect the user to any
// of the available locales that we have enabled on the website
export const availableLocales = localeConfig.filter(locale => locale.enabled);

// This gives an easy way of accessing all available locale codes
export const availableLocaleCodes = availableLocales.map(locale => locale.code);

// This provides the default locale information for the Next.js Application
// This is marked by the unique `locale.default` property on the `en` locale
export const defaultLocale = availableLocales.find(locale => locale.default);

// Creates a Map of available locales for easy access
export const availableLocalesMap = Object.fromEntries(
  localeConfig.map(locale => [locale.code, locale])
);
