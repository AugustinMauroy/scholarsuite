import { getServerSession } from 'next-auth';
import { notFound } from 'next/navigation';
import BaseLayout from '@/components/Layout/Base';
import Table from '@/components/timeSlot/Table';
import nextAuthConfig from '@/lib/auth';
import type { FC } from 'react';

const Page: FC = async () => {
  const session = await getServerSession(nextAuthConfig);
  if (session?.user.role !== 0) notFound();

  return (
    <BaseLayout title="Time Slot" description="Manage your school time slots">
      <Table />
    </BaseLayout>
  );
};

export default Page;
