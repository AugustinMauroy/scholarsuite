import { getServerSession } from 'next-auth/next';
import AuthProvider from '@/providers/auth';
import LocaleProvider from '@/providers/locale';
import { getLanguage, getTimeZone, getMessages } from '@/lib/i18n';
import ClassNav from '@/components/Common/ClassNav';
import Header from '@/components/Layout/Header';
import nextAuthConfig from '@/lib/auth';
import styles from './layout.module.css';
import type { Metadata } from 'next';
import type { FC, PropsWithChildren } from 'react';
import '@/styles/globals.css';

const generateMetadata = async (): Promise<Metadata> => {
  const language = getLanguage();
  const messages = await getMessages(language);

  return {
    title: messages.app.metadata.title,
    description: messages.app.metadata.description,
    // @TODO use .env to set the base URL
    metadataBase: new URL(`http://localhost:3000`),
  };
};

const RootLayout: FC<PropsWithChildren> = async ({ children }) => {
  const language = getLanguage();
  const timeZone = getTimeZone();
  const messages = await getMessages(language);
  const sessionData = await getServerSession(nextAuthConfig);

  return (
    <html lang={language}>
      <AuthProvider>
        <LocaleProvider
          locale={language}
          messages={messages}
          timeZone={timeZone}
        >
          {sessionData ? (
            <body className={styles.body}>
              <ClassNav />
              <div className={styles.wrapper}>
                <Header />
                {children}
              </div>
            </body>
          ) : (
            <body>{children}</body>
          )}
        </LocaleProvider>
      </AuthProvider>
    </html>
  );
};

export { generateMetadata };
export default RootLayout;
