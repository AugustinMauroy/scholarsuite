/**
 * To finish this page need to finish `attendance/absence/[id]` page
 * Because it's the same idea of design
 */
import { notFound } from 'next/navigation';
import prisma from '@/lib/prisma';
import StudentCard from '@/components/Student/StudentCard';
import BaseLayout from '@/components/Layout/Base';
import type { FC } from 'react';
import type { Student } from '@prisma/client';

type PageProps = {
  params: { id: string };
};

const Page: FC<PageProps> = async ({ params }) => {
  if (Number.isNaN(Number(params.id))) notFound();

  const disciplinaryReports = await prisma.disciplinaryReport.findUnique({
    where: { id: Number(params.id) },
    include: {
      CreatedBy: true,
      Student: {
        include: {
          Class: true,
        },
      },
    },
  });

  if (!disciplinaryReports) notFound();

  return (
    <BaseLayout title="Disciplinary Report">
      <StudentCard student={disciplinaryReports.Student as Student} />
      <p>{disciplinaryReports.description}</p>
      <p>{new Date(disciplinaryReports.date).toLocaleDateString()}</p>
      <p>Created by: {disciplinaryReports.CreatedBy.firstName}</p>
    </BaseLayout>
  );
};

export default Page;
