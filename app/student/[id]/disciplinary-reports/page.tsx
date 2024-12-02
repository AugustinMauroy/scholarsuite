import Link from 'next/link';
import { notFound } from 'next/navigation';
import prisma from '@/lib/prisma';
import Card from '@/components/Common/Card';
import BaseLayout from '@/components/Layout/Base';
import type { FC } from 'react';

type PageProps = {
  params: Promise<{ id: string }>;
};

const Page: FC<PageProps> = async ({ params }) => {
  const { id } = await params;
  if (Number.isNaN(Number(id))) notFound();

  const disciplinaryReports = await prisma.disciplinaryReport.findMany({
    where: {
      studentId: Number(id),
    },
    include: {
      CreatedBy: true,
      Group: true,
    },
  });
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

  return (
    <BaseLayout title={`${student.firstName} ${student.lastName}`}>
      <div className="flex flex-col space-y-4">
        {disciplinaryReports.map(report => (
          <Card key={report.id}>
            <p>Created by: {report.CreatedBy.firstName}</p>
            <p>Date: {new Date(report.createdAt).toLocaleDateString()}</p>
            {report.Group && <p>Group: {report.Group.name}</p>}
            <Link href={`/disciplinary-reports/${report.id}`}>View</Link>
          </Card>
        ))}
        {disciplinaryReports.length === 0 && (
          <p>Student has no disciplinary reports</p>
        )}
      </div>
    </BaseLayout>
  );
};

export default Page;
