import { getServerSession } from 'next-auth';
import { notFound } from 'next/navigation';
import ReviewPresence from '@/components/Presence/ReviewPresence';
import nextAuthConfig from '@/lib/auth';
import BaseLayout from '@/components/Layout/Base';
import type { FC } from 'react';

const Page: FC = async () => {
  const session = await getServerSession(nextAuthConfig);
  if (session && session.user.role !== 'MANAGER') notFound();

  return (
    <BaseLayout title="Review Presence">
      <ReviewPresence />
    </BaseLayout>
  );
};

export default Page;
