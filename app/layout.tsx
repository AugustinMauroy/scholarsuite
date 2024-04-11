import { getTranslations } from 'next-intl/server';
import AuthProvider from '@/providers/auth';
import LocaleProvider from '@/providers/locale';
import { getLanguage, getTimeZone, getMessages } from '@/lib/i18n';
import type { Metadata } from 'next';
import type { FC, PropsWithChildren } from 'react';
import '@/styles/globals.css';

const generateMetadata = async (): Promise<Metadata> => {
  const t = await getTranslations('app.metadata');

  return {
    title: t('title'),
    description: t('description'),
    // @TODO use .env to set the base URL
    metadataBase: new URL(`http://localhost:3000`),
  };
};

const RootLayout: FC<PropsWithChildren> = async ({ children }) => {
  const language = getLanguage();
  const timeZone = getTimeZone();
  const messages = await getMessages(language);

  return (
    <html lang={language}>
      <body>
        <AuthProvider>
          <LocaleProvider
            locale={language}
            messages={messages}
            timeZone={timeZone}
          >
            {children}
          </LocaleProvider>
        </AuthProvider>
      </body>
    </html>
  );
};

export { generateMetadata };
export default RootLayout;
