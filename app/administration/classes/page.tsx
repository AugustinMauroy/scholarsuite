import Table from '@/components/Classes/Table';
import BaseLayout from '@/components/Layout/Base';
import prisma from '@/lib/prisma';
import type { FC } from 'react';

const Page: FC = async () => {
  const classes = await prisma.class.findMany({
    include: {
      SchoolLevel: true,
    },
  });

  return (
    <BaseLayout title="Classes" description="Manage your classes">
      <Table classes={classes} />
    </BaseLayout>
  );
};

export default Page;
