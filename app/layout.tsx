import classNames from 'classnames';
import { getServerSession } from 'next-auth/next';
import { getLocale, getMessages, getTranslations } from 'next-intl/server';
import NavBar from '@/components/Layout/NavBar';
import nextAuthConfig from '@/lib/auth';
import { getTimeZone } from '@/lib/i18n';
import AuthProvider from '@/providers/auth';
import LocaleProvider from '@/providers/locale';
import { ToastProvider } from '@/providers/toastProvider';
import styles from './layout.module.css';
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
  const locale = await getLocale();
  const messages = await getMessages();
  const timeZone = getTimeZone();
  const sessionData = await getServerSession(nextAuthConfig);

  return (
    <html lang={locale}>
      <body
        className={classNames({
          [styles.body]: sessionData,
        })}
      >
        <AuthProvider>
          <LocaleProvider
            locale={locale}
            messages={messages}
            timeZone={timeZone}
          >
            <ToastProvider viewportClassName={styles.notif}>
              {sessionData ? (
                <>
                  <NavBar />
                  <div className={styles.wrapper}>{children}</div>
                </>
              ) : (
                children
              )}
            </ToastProvider>
          </LocaleProvider>
        </AuthProvider>
      </body>
    </html>
  );
};

export { generateMetadata };
export default RootLayout;
