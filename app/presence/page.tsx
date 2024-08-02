import { notFound } from 'next/navigation';
import BaseLayout from '@/components/Layout/Base';
import ReviewPresence from '@/components/Presence/ReviewPresence';
import rightAcces from '@/utils/rightAcces';
import type { FC } from 'react';

const Page: FC = async () => {
  const access = await rightAcces(['MANAGER', 'ADMIN']);
  if (!access) notFound();

  return (
    <BaseLayout
      title="Review Presence"
      description="Review all the presence of students"
    >
      <ReviewPresence />
    </BaseLayout>
  );
};

export default Page;
