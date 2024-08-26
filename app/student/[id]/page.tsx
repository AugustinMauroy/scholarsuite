import { notFound } from 'next/navigation';
import BackTo from '@/components/Common/BackTo';
import BaseLayout from '@/components/Layout/Base';
import prisma from '@/lib/prisma';
import type { FC } from 'react';

type PageProps = {
  params: { id: string };
};

const Page: FC<PageProps> = async ({ params }) => {
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
    (await prisma.presence.count({
      where: {
        studentId: Number(params.id),
        state: 'ABSENT',
        academicYearId: currentAcademicYear.id,
      },
    }));
  const numbOfLate =
    currentAcademicYear &&
    (await prisma.presence.count({
      where: {
        studentId: Number(params.id),
        state: 'LATE',
        academicYearId: currentAcademicYear.id,
      },
    }));

  return (
    <BaseLayout>
      <BackTo />
      <h1>
        {student.firstName} {student.lastName}
      </h1>
      {student.Class && <p>Class : {student.Class.name}</p>}
      {student.dateOfBirth && (
        <p>Born : {student.dateOfBirth.toDateString()}</p>
      )}
      {numbOfAbsent !== 0 && <p>Numb of Absent this year : {numbOfAbsent}</p>}
      {numbOfLate !== 0 && <p>Numb of Late this year : {numbOfLate}</p>}
      {student.StudentGroup && (
        <ul className="list-disc">
          <label>Groups:</label>
          {student.StudentGroup.map(({ Group }) => (
            <li key={Group.id}>{Group.name}</li>
          ))}
        </ul>
      )}
    </BaseLayout>
  );
};

export default Page;
