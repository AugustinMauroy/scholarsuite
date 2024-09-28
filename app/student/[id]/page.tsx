import { notFound } from 'next/navigation';
import BackTo from '@/components/Common/BackTo';
import BaseLayout from '@/components/Layout/Base';
import Label from '@/components/Common/Label';
import prisma from '@/lib/prisma';
import StudentAvatar from '@/components/Student/StudentAvatar';
import styles from './page.module.css';
import type { FC } from 'react';

type PageProps = {
  params: { id: string };
};

const Page: FC<PageProps> = async ({ params }) => {
  if (Number.isNaN(Number(params.id))) notFound();

  const student = await prisma.student.findUnique({
    where: { id: Number(params.id) },
    include: {
      Class: true,
      StudentGroup: {
        include: {
          Group: true,
        },
      },
    },
  });

  if (!student) notFound();

  const now = new Date();
  const currentAcademicYear = await prisma.academicYear.findFirst({
    where: {
      startDate: { lte: now },
      endDate: { gte: now },
    },
  });
  const numbOfAbsent =
    currentAcademicYear &&
    (await prisma.attendance.count({
      where: {
        studentId: Number(params.id),
        state: 'ABSENT',
        academicYearId: currentAcademicYear.id,
      },
    }));
  const numbOfLate =
    currentAcademicYear &&
    (await prisma.attendance.count({
      where: {
        studentId: Number(params.id),
        state: 'LATE',
        academicYearId: currentAcademicYear.id,
      },
    }));

  return (
    <BaseLayout
      title={`${student.firstName} ${student.lastName}`}
      actions={<BackTo />}
    >
      <StudentAvatar student={student} />
      {student.Class && <p>Class : {student.Class.name}</p>}
      {student.dateOfBirth && (
        <p>Born : {student.dateOfBirth.toDateString()}</p>
      )}
      {numbOfAbsent !== 0 && <p>Numb of Absent this year : {numbOfAbsent}</p>}
      {numbOfLate !== 0 && <p>Numb of Late this year : {numbOfLate}</p>}
      {student.StudentGroup && (
        <>
          <Label>Groups</Label>
          <ul className={styles.groups}>
            {student.StudentGroup.map(({ Group }) => (
              <li key={Group.id}>{Group.name}</li>
            ))}
          </ul>
        </>
      )}
    </BaseLayout>
  );
};

export default Page;
