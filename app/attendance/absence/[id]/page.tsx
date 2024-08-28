'use client';
import { notFound } from 'next/navigation';
import { useState, useEffect } from 'react';
import BaseLayout from '@/components/Layout/Base';
import StudentCard from '@/components/Student/StudentCard';
import type {
  AbsencePeriod,
  Student,
  Class,
  Group,
  TimeSlot,
} from '@prisma/client';
import type { FC } from 'react';

type PageProps = {
  params: { id: string };
};

type AbsencePeriodWithRelations = AbsencePeriod & {
  Student: Student & { Class: Class };
  FirstAbsence: { Group: Group; TimeSlot: TimeSlot };
  LastAbsence: { Group: Group; TimeSlot: TimeSlot };
  NextPresence: { date: Date; TimeSlot: TimeSlot };
  Comments: {
    id: number;
    User: { firstName: string; lastName: string };
    comment: string;
    createdAt: Date;
  }[];
};

const Page: FC<PageProps> = ({ params }) => {
  const id = Number(params.id);
  if (isNaN(id)) notFound();

  const [absence, setAbsence] = useState<
    AbsencePeriodWithRelations | null | undefined
  >(undefined);

  useEffect(() => {
    fetch(`/api/absence-period/${id}`, {
      method: 'POST',
    })
      .then(res => res.json())
      .then(data => setAbsence(data.data));
  }, [id]);

  if (absence === undefined) {
    return <BaseLayout title="Absence" description="Loading..." />;
  }
  if (absence === null) notFound();

  return (
    <BaseLayout title={`Absence of ${absence.Student.firstName}`}>
      <div className="flex items-center justify-between">
        <StudentCard
          withInfo
          student={{
            ...absence.Student,
            className: absence.Student.Class?.name,
          }}
        />
        {/*
        action for the absence will be here
      */}
      </div>
      <div className="mt-8">
        <h2 className="mb-2 text-lg font-medium">Absence Details</h2>
        <dl className="grid grid-cols-2 gap-x-4 gap-y-2">
          <div>
            <dt className="text-sm font-medium text-gray-500 dark:text-gray-400">
              First Absence
            </dt>
            <dd className="text-lg">
              At : {absence.FirstAbsence?.Group?.name}
            </dd>
            <dd className="text-sm text-gray-500 dark:text-gray-400">
              On : {absence.FirstAbsence.TimeSlot.name}
            </dd>
          </div>
          <div>
            <dt className="text-sm font-medium text-gray-500 dark:text-gray-400">
              Last Absence
            </dt>
            <dd className="text-lg">At : {absence.LastAbsence?.Group?.name}</dd>
            <dd className="text-sm text-gray-500 dark:text-gray-400">
              On: {absence.LastAbsence.TimeSlot.name}
            </dd>
          </div>
          {absence.NextPresence && (
            <div>
              <dt className="text-sm font-medium text-gray-500 dark:text-gray-400">
                Next Presence
              </dt>
              <dd className="text-sm text-gray-500 dark:text-gray-400">
                On : {absence.NextPresence?.date.toLocaleString()}
              </dd>
            </div>
          )}
        </dl>
      </div>
      <div className="mt-8">
        <h2 className="mb-2 text-lg font-medium">Comments</h2>
        {absence.Comments.length > 0 ? (
          <ul className="space-y-4">
            {absence.Comments.map(comment => (
              <li key={comment.id} className="rounded-lg border p-4">
                <p className="text-sm text-gray-500">
                  {comment.User.firstName} {comment.User.lastName} -{' '}
                  {comment.createdAt.toLocaleString()}
                </p>
                <p className="mt-2">{comment.comment}</p>
              </li>
            ))}
          </ul>
        ) : (
          <p className="text-gray-500">No comments yet.</p>
        )}
      </div>
    </BaseLayout>
  );
};

export default Page;
