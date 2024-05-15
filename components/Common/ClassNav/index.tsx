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
      course: {
        where: {
          userCourse: {
            some: {
              userId: teacherId,
            },
          },
        },
      },
    },
    where: {
      course: {
        some: {
          userCourse: {
            some: {
              userId: teacherId,
            },
          },
        },
      },
    },
  });

  return <Nav items={schoolLevels} />;
};

export default ClassNav;
