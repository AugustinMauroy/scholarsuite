import Table from '@/components/AcademicYear/Table';
import BaseLayout from '@/components/Layout/Base';
import type { FC } from 'react';

const Page: FC = () => (
  <BaseLayout title="Academic Years" description="Manage your academic years">
    <Table />
  </BaseLayout>
);

export default Page;
