import { getServerSession } from 'next-auth/next';
import AuthProvider from '@/providers/auth';
import LocaleProvider from '@/providers/locale';
import { getLanguage, getTimeZone, getMessages } from '@/lib/i18n';
import ClassNav from '@/components/Common/ClassNav';
import Header from '@/components/Layout/Header';
import nextAuthConfig from '@/lib/auth';
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
      <body>
        <AuthProvider>
          <LocaleProvider
            locale={language}
            messages={messages}
            timeZone={timeZone}
          >
            {sessionData ? (
              <div className="flex h-full flex-row">
                <ClassNav />
                <div className="flex size-full flex-col">
                  <Header />
                  <main className="flex-grow">{children}</main>
                </div>
              </div>
            ) : (
              children
            )}
          </LocaleProvider>
        </AuthProvider>
      </body>
    </html>
  );
};

export { generateMetadata };
export default RootLayout;
