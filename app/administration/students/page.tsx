import { getServerSession } from 'next-auth';
import { notFound } from 'next/navigation';
import prisma from '@/lib/prisma';
import Table from '@/components/Student/Table';
import nextAuthConfig from '@/lib/auth';
import BaseLayout from '@/components/Layout/Base';
import type { FC } from 'react';

const Page: FC = async () => {
  const session = await getServerSession(nextAuthConfig);
  if (session?.user.role !== 0) notFound();

  const students = await prisma.student.findMany({
    include: {
      class: true,
    },
  });

  const possibleClasses = await prisma.class.findMany();

  return (
    <BaseLayout title="Administration" description="Manage your school">
      <Table students={students} possibleClasses={possibleClasses} />
    </BaseLayout>
  );
};

export default Page;
