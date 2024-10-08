import Table from '@/components/Group/Table';
import BaseLayout from '@/components/Layout/Base';
import type { FC } from 'react';

const Page: FC = () => (
  <BaseLayout title="Groups" description="Manage your groups">
    <Table />
  </BaseLayout>
);

export default Page;
