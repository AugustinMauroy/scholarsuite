import BaseLayout from '@/components/Layout/Base';
import UsersTable from '@/components/User/Table';
import type { FC } from 'react';

const Page: FC = () => (
  <BaseLayout title="Users" description="Manage your users">
    <UsersTable />
  </BaseLayout>
);

export default Page;
