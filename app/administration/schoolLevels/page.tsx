import { getServerSession } from 'next-auth';
import { notFound } from 'next/navigation';
import BaseLayout from '@/components/Layout/Base';
import SchoolLevelsTable from '@/components/SchoolLevel/Table';
import nextAuthConfig from '@/lib/auth';
import type { FC } from 'react';

const Page: FC = async () => {
  const session = await getServerSession(nextAuthConfig);
  if (!session || session.user.role !== 'ADMIN') notFound();

  return (
    <BaseLayout title="School Levels" description="Manage your school levels">
      <SchoolLevelsTable />
    </BaseLayout>
  );
};

export default Page;
