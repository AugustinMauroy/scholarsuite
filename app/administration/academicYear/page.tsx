import { getServerSession } from 'next-auth';
import { notFound } from 'next/navigation';
import BaseLayout from '@/components/Layout/Base';
import Table from '@/components/AcademicYear';
import nextAuthConfig from '@/lib/auth';
import type { FC } from 'react';

const Page: FC = async () => {
  const session = await getServerSession(nextAuthConfig);
  if (session?.user.role !== 'ADMIN') notFound();

  return (
    <BaseLayout
      title="Academic Year"
      description="Manage your school academic years"
    >
      <Table />
    </BaseLayout>
  );
};

export default Page;
