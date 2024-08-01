import { getServerSession } from 'next-auth';
import Nav from '@/components/Common/GroupNav/nav';
import nextAuthConfig from '@/lib/auth';
import prisma from '@/lib/prisma';
import type { FC } from 'react';

const GroupNav: FC = async () => {
  const sessions = await getServerSession(nextAuthConfig);

  const userId = sessions?.user.id;

  if (!userId) return null;

  const schoolLevels = await prisma.schoolLevel.findMany({
    include: {
      group: {
        where: {
          userGroup: {
            some: {
              userId,
            },
          },
        },
      },
    },
    where: {
      group: {
        some: {
          userGroup: {
            some: {
              userId,
            },
          },
        },
      },
    },
  });

  return <Nav items={schoolLevels} />;
};

export default GroupNav;
