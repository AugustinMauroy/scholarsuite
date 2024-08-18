import { getServerSession } from 'next-auth';
import { getTranslations } from 'next-intl/server';
import BaseLayout from '@/components/Layout/Base';
import nextAuthConfig from '@/lib/auth';
import type { FC } from 'react';

const Page: FC = async () => {
  const session = await getServerSession(nextAuthConfig);
  const t = await getTranslations('app.landing');

  const firstName = session?.user?.firstName;
  const lastName = session?.user?.lastName;

  return <BaseLayout title={t('title', { firstName, lastName })} />;
};

export default Page;
