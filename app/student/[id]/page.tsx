import { notFound } from 'next/navigation';
import BackTo from '@/components/Common/BackTo';
import BaseLayout from '@/components/Layout/Base';
import Label from '@/components/Common/Label';
import prisma from '@/lib/prisma';
import StudentCard from '@/components/Student/StudentCard';
import Card from '@/components/Common/Card';
import styles from './page.module.css';
import type { FC } from 'react';
import type { Student } from '@prisma/client';

type PageProps = {
  params: Promise<{ id: string }>;
};

const Page: FC<PageProps> = async ({ params }) => {
  const { id } = await params;
  if (Number.isNaN(Number(id))) notFound();

  const student = await prisma.student.findUnique({
    where: { id: Number(id) },
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

  const currentAcademicYear = await prisma.academicYear.findFirst({
    where: { current: true },
  });

  const numbOfAbsent =
    currentAcademicYear &&
    (await prisma.attendance.count({
      where: {
        studentId: Number(id),
        state: 'ABSENT',
        academicYearId: currentAcademicYear.id,
      },
    }));
  const numbOfLate =
    currentAcademicYear &&
    (await prisma.attendance.count({
      where: {
        studentId: Number(id),
        state: 'LATE',
        academicYearId: currentAcademicYear.id,
      },
    }));

  return (
    <BaseLayout
      title="Student Details"
      actions={<BackTo />}
      sectionClassName={styles.page}
    >
      <StudentCard student={student as Student} withDateOfBirth />
      {numbOfAbsent !== 0 && <p>Numb of Absent this year : {numbOfAbsent}</p>}
      {numbOfLate !== 0 && <p>Numb of Late this year : {numbOfLate}</p>}
      {student.StudentGroup && (
        <Card>
          <Label>Groups</Label>
          <ul className={styles.groups}>
            {student.StudentGroup.map(({ Group }) => (
              <li key={Group.id}>{Group.name}</li>
            ))}
          </ul>
        </Card>
      )}
    </BaseLayout>
  );
};

export default Page;
