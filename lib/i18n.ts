import { headers } from 'next/headers';
import { getRequestConfig } from 'next-intl/server';
import localeConfig from '@/i18n/config.json' assert { type: 'json' };

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

export const getMessages = (locale: string) => {
  if (locale === 'en') {
    // This enables HMR on the English Locale, so that instant refresh
    // happens while we add/change texts on the source locale
    return import('@/i18n/locales/en.json').then(f => f.default);
  }

  if (availableLocaleCodes.includes(locale)) {
    // Other languages don't really require HMR as they will never be development languages
    // so we can load them dynamically
    return (
      import(`../i18n/locales/${locale}.json`)
        .then(f => f.default)
        // add a fallback in case the locale file is not found
        .catch(() => import('../i18n/locales/en.json').then(f => f.default))
    );
  }

  throw new Error(`Unsupported locale: ${locale}`);
};

export const getLanguage = () => {
  const headersList = headers();
  const acceptLanguage = headersList.get('accept-language');
  const languages = acceptLanguage
    ?.split(',')
    .map(lang => lang.split(';')[0])[1];

  if (languages && availableLocaleCodes.includes(languages)) {
    return languages;
  }

  return defaultLocale?.code ?? 'en';
};

export const getTimeZone = () => {
  const headersList = headers();
  const timeZone = headersList.get('time-zone');

  return timeZone || 'UTC';
};

export default getRequestConfig(async () => {
  const locale = getLanguage();

  return {
    locale,
    messages: await getMessages(locale),
  };
});
