import { getServerSession } from 'next-auth';
import { getTranslations } from 'next-intl/server';
import BaseLayout from '@/components/Layout/Base';
import nextAuthConfig from '@/lib/auth';
import prisma from '@/lib/prisma';
import type { FC } from 'react';

const Page: FC = async () => {
  const session = await getServerSession(nextAuthConfig);
  const t = await getTranslations('app.landing');

  const firstName = session?.user?.firstName;
  const lastName = session?.user?.lastName;

  const currentAcademicYear = await prisma.academicYear.findFirst({
    where: { current: true },
  });

  return (
    <BaseLayout
      title={t('title', { firstName, lastName })}
      description={t('description', {
        academicYear: currentAcademicYear?.name,
      })}
    />
  );
};

export default Page;
