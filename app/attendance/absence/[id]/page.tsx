'use client';
import { notFound } from 'next/navigation';
import { useSession } from 'next-auth/react';
import { useState, useEffect } from 'react';
import Button from '@/components/Common/Button';
import BaseLayout from '@/components/Layout/Base';
import { useCommand } from '@/hooks/useCommand';
import Messages from './AbsencePeriod/Messages';
import Overview from './AbsencePeriod/Overview';
import type {
  AbsencePeriod,
  Student,
  Class,
  Group,
  TimeSlot,
  AbsencePeriodComment,
  User,
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
  Comments: Array<AbsencePeriodComment & { User: User }>;
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
        if (data.error) throw new Error(data.error);

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
      <Overview absence={absence} />
      <div className="mt-8">
        <Messages comments={absence.Comments} />
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
