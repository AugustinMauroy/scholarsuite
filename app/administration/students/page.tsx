import BaseLayout from '@/components/Layout/Base';
import Table from '@/components/Student/Table';
import prisma from '@/lib/prisma';
import type { FC } from 'react';

const Page: FC = async () => {
  const students = await prisma.student.findMany({
    include: {
      Class: true,
    },
  });

  const possibleClasses = await prisma.class.findMany({
    include: {
      SchoolLevel: true,
    },
  });

  return (
    <BaseLayout title="Administration" description="Manage your school">
      <Table students={students} possibleClasses={possibleClasses} />
    </BaseLayout>
  );
};

export default Page;
