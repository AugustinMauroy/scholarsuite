import BaseLayout from '@/components/Layout/Base';
import Table from '@/components/TimeSlot/Table';
import type { FC } from 'react';

const Page: FC = () => (
  <BaseLayout title="Time Slot" description="Manage your school time slots">
    <Table />
  </BaseLayout>
);

export default Page;
