import { headers } from 'next/headers';
import { getRequestConfig } from 'next-intl/server';
import { auth } from '@/lib/auth.ts';
import { routing } from './routing.ts';

// Loads the Application Locales/Translations Dynamically
const loadLocaleDictionary = async (locale: string) => {
  if (locale === 'en') {
    // This enables HMR on the English Locale, so that instant refresh
    // happens while we add/change texts on the source locale
    return import('@/i18n/locales/en.json').then(f => f.default);
  }

  if (routing.locales.includes(locale)) {
    // Other languages don't really require HMR as they will never be development languages
    // so we can load them dynamically
    return import(`@/i18n/locales/${locale}.json`).then(f => f.default);
  }

  throw new Error(`Unsupported locale: ${locale}`);
};

const getLanguage = async () => {
  const session = await auth();
  const headersList = await headers();
  const acceptLanguage = headersList.get('accept-language');
  const languages = acceptLanguage
    ?.split(',')
    .map(lang => lang.split(';')[0])[1];

  if (
    session?.user?.preferredLanguage &&
    routing.locales.includes(session?.user?.preferredLanguage)
  )
    return session?.user?.preferredLanguage;

  if (languages && routing.locales.includes(languages)) return languages;

  return routing.defaultLocale;
};

const getTimeZone = async () => {
  const headersList = await headers();
  const timeZone = headersList.get('time-zone');

  return timeZone || 'UTC';
};

export default getRequestConfig(async () => {
  const locale = await getLanguage();
  const messages = await loadLocaleDictionary(locale);
  const timeZone = await getTimeZone();

  return {
    locale,
    messages,
    timeZone,
  };
});
