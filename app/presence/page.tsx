import { getServerSession } from 'next-auth/next';
import BaseLayout from '@/components/Layout/Base/index.tsx';
import Component from '@/components/Presence/AbsencePeriodsList/index.tsx';
import prisma from '@/lib/prisma';
import type { FC } from 'react';

const AbsencePeriodPage: FC = async () => {
  const session = await getServerSession();
  const userId = session?.user.id;

  // Fetch groups of the user
  const userGroups = await prisma.userGroup.findMany({
    where: {
      userId: userId,
    },
    include: {
      Group: {
        include: {
          StudentGroup: {
            include: {
              Student: true,
            },
          },
        },
      },
    },
  });

  // Extract student ids from the groups
  const studentIds = userGroups.flatMap(userGroup =>
    userGroup.Group.StudentGroup.map(studentGroup => studentGroup.Student.id)
  );

  // Fetch absence periods for the students
  const absencePeriods = await prisma.absencePeriod.findMany({
    where: {
      studentId: {
        in: studentIds,
      },
    },
    include: {
      Student: {
        include: {
          Class: true,
        },
      },
      AcademicYear: true,
      FirstAbsence: true,
      LastAbsence: true,
      NextPresence: true,
    },
  });

  return (
    <BaseLayout title="Absence Periods">
      <Component absencePeriods={absencePeriods} />
    </BaseLayout>
  );
};

export default AbsencePeriodPage;
