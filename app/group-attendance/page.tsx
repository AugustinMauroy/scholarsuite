import prisma from '@/lib/prisma';
import GroupPage from '@/components/Group/Page';
import type { FC } from 'react';

const Page: FC = async () => {
  const data = await prisma.group.findMany({
    include: {
      Subject: true,
    },
  });

  return <GroupPage groups={data} />;
};

export default Page;
