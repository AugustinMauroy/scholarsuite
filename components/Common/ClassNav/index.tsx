import { getServerSession } from 'next-auth';
import nextAuthConfig from '@/lib/auth';
import prisma from '@/lib/prisma';
import Nav from './nav';
import type { FC } from 'react';

const ClassNav: FC = async () => {
  const sessions = await getServerSession(nextAuthConfig);

  const teacherId = sessions?.user.id;

  if (!teacherId) return null;

  const schoolLevels = await prisma.schoolLevel.findMany({
    include: {
      classes: {
        where: {
          classUsers: {
            some: {
              userId: teacherId,
            },
          },
        },
        include: {
          classUsers: true,
        },
      },
    },
  });

  const navItems = schoolLevels.filter(level => level.classes.length > 0);

  return <Nav items={navItems} />;
};

export default ClassNav;
