import { notFound } from 'next/navigation';
import { getServerSession } from 'next-auth';
import Table from '@/components/Courses/Table';
import BaseLayout from '@/components/Layout/Base';
import nextAuthConfig from '@/lib/auth';
import type { FC } from 'react';

const Page: FC = () => (
  <BaseLayout>
    <Table />
  </BaseLayout>
);

export default Page;
