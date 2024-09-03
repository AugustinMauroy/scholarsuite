'use client';
import { EllipsisIcon } from 'lucide-react';
import { notFound } from 'next/navigation';
import { useSession } from 'next-auth/react';
import { useState, useEffect } from 'react';
import Button from '@/components/Common/Button';
import BaseLayout from '@/components/Layout/Base';
import StudentCard from '@/components/Student/StudentCard';
import { useCommand } from '@/hooks/useCommand';
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

  const session = useSession();
  const [absence, setAbsence] = useState<
    AbsencePeriodWithRelations | null | undefined
  >(undefined);
  const [message, setMessage] = useState<string>('');

  useEffect(() => {
    fetch(`/api/absence-period/${id}`, {
      method: 'POST',
    })
      .then(res => res.json())
      .then(data => setAbsence(data.data));
  }, [id]);

  const handleAddComment = () => {
    if (!session.data?.user.id) throw new Error('User not logged in');
    if (message.length === 0) return;

    fetch('/api/absence-period/comment', {
      method: 'POST',
      body: JSON.stringify({
        comment: message,
        absencePeriodId: id,
        userId: session.data.user.id,
      }),
    })
      .then(res => res.json())
      .then(data => {
        setAbsence(prev => {
          if (prev === undefined) return prev;
          if (prev === null) return prev;

          return {
            ...prev,
            Comments: data.data,
          };
        });
        setMessage('');
      });
  };

  useCommand('Enter', handleAddComment);

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
        {/* action for the absence will be here */}
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
              <li
                key={comment.id}
                className="rounded-lg border border-gray-200 p-4 dark:border-gray-700"
              >
                {/*
                  dropDownMenu will be here
                  - Edit
                  - Delete
                  - hide
                */}
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
        {session.data?.user.id && (
          <>
            <textarea
              className="mt-4 min-h-10 w-full resize-y rounded-lg border p-2 focus:outline-none focus:ring focus:ring-violet-500  dark:border-gray-700 dark:bg-gray-800"
              placeholder="Add a comment..."
              value={message}
              onChange={e => setMessage(e.target.value)}
            />
            <Button
              className="float-right mt-4"
              onClick={handleAddComment}
              disabled={message.length === 0}
            >
              Add Comment
            </Button>
          </>
        )}
      </div>
    </BaseLayout>
  );
};

export default Page;
