import { getServerSession } from 'next-auth';
import { notFound } from 'next/navigation';
import BaseLayout from '@/components/Layout/Base';
import nextAuthConfig from '@/lib/auth';
import Table from '@/components/Courses/Table';
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
