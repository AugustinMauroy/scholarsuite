import Table from '@/components/Classes/Table';
import BaseLayout from '@/components/Layout/Base';
import prisma from '@/lib/prisma';
import type { FC } from 'react';

const Page: FC = async () => {
  const classes = await prisma.class.findMany({
    include: {
      schoolLevel: true,
    },
  });

  return (
    <BaseLayout>
      <Table classes={classes} />
    </BaseLayout>
  );
};

export default Page;
