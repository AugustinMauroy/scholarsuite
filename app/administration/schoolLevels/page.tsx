import BaseLayout from '@/components/Layout/Base';
import SchoolLevelsTable from '@/components/SchoolLevel/Table';
import type { FC } from 'react';

const Page: FC = () => (
  <BaseLayout title="School Levels" description="Manage your school levels">
    <SchoolLevelsTable />
  </BaseLayout>
);

export default Page;
