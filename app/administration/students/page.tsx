import prisma from '@/lib/prisma';
import Table from '@/components/Student/Table';
import BaseLayout from '@/components/Layout/Base';
import type { FC } from 'react';

const Page: FC = async () => {
  const students = await prisma.student.findMany({
    include: {
      class: true,
    },
  });

  const possibleClasses = await prisma.class.findMany({
    include: {
      schoolLevel: true,
    },
  });

  return (
    <BaseLayout title="Administration" description="Manage your school">
      <Table students={students} possibleClasses={possibleClasses} />
    </BaseLayout>
  );
};

export default Page;
