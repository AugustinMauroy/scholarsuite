import BaseLayout from '@/components/Layout/base';
import Table from '@/components/timeSlot/Table';
import type { FC } from 'react';

const Page: FC = () => (
  <BaseLayout title="Time Slot" description="Manage your school time slots">
    <Table />
  </BaseLayout>
);

export default Page;
