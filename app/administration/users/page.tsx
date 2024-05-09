import { notFound } from 'next/navigation';
import { getServerSession } from 'next-auth';
import BaseLayout from '@/components/Layout/Base';
import UsersTable from '@/components/User/Table';
import nextAuthConfig from '@/lib/auth';
import type { FC } from 'react';

const Page: FC = async () => {
  const session = await getServerSession(nextAuthConfig);
  if (!session || session.user.role !== 'ADMIN') notFound();

  return (
    <BaseLayout title="Users" description="Manage your school users">
      <UsersTable />
    </BaseLayout>
  );
};

export default Page;
