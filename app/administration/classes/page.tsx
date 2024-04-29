import { getServerSession } from 'next-auth';
import { notFound } from 'next/navigation';
import nextAuthConfig from '@/lib/auth';
import prisma from '@/lib/prisma';
import Table from '@/components/Classes/Table';
import BaseLayout from '@/components/Layout/Base';
import type { FC } from 'react';

const Page: FC = async () => {
  const session = await getServerSession(nextAuthConfig);
  if (session?.user.role !== 0) notFound();

  const classes = await prisma.class.findMany({
    include: {
      schoolLevel: true,
    },
  });

  return (
    <BaseLayout title="Administration" description="Manage your school">
      <Table classes={classes} />
    </BaseLayout>
  );
};

export default Page;
