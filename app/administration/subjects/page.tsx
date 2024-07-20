import { getServerSession } from 'next-auth';
import { notFound } from 'next/navigation';
import BaseLayout from '@/components/Layout/Base';
import Table from '@/components/Subjects/Table';
import nextAuthConfig from '@/lib/auth';
import type { FC } from 'react';

const Page: FC = async () => {
  const session = await getServerSession(nextAuthConfig);
  if (session?.user.role !== 'ADMIN') notFound();

  return (
    <BaseLayout>
      <Table />
    </BaseLayout>
  );
};

export default Page;
