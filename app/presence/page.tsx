import { notFound } from 'next/navigation';
import ReviewPresence from '@/components/Presence/ReviewPresence';
import rightAcces from '@/utils/rightAcces';
import BaseLayout from '@/components/Layout/Base';
import type { FC } from 'react';

const Page: FC = async () => {
  const access = await rightAcces(['MANAGER', 'ADMIN']);
  if (!access) notFound();

  return (
    <BaseLayout title="Review Presence">
      <ReviewPresence />
    </BaseLayout>
  );
};

export default Page;
