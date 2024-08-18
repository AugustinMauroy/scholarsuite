'use client';
import { ThumbsUpIcon, UserXIcon, HourglassIcon } from 'lucide-react';
import { useSession } from 'next-auth/react';
import { useTranslations } from 'next-intl';
import { useState, useEffect } from 'react';
import BaseLayout from '@/components/Layout/Base';
import StudentCard from '@/components/Student/StudentCard';
import Selector from '@/components/TimeSlot/Selector';
import { useToast } from '@/hooks/useToast';
import styles from './page.module.css';
import type { PatchBody } from '@/types/presence';
import type {
  Student,
  Group,
  TimeSlot,
  Presence,
  PresenceState,
  Class,
} from '@prisma/client';
import type { FC } from 'react';

type PageProps = {
  params: { id: string };
};

type StudentWithPresence = Student & {
  presence: Presence[];
  class: Class | null;
};

type GroupWithStudents = Group & {
  StudentGroup: {
    student: StudentWithPresence;
  }[];
};

const Page: FC<PageProps> = ({ params }) => {
  const tPage = useTranslations('app.groupPresence');
  const tShared = useTranslations('shared');
  const session = useSession();
  const toast = useToast();
  const [groupData, setGroupData] = useState<GroupWithStudents | null>(null);
  const [timeSlot, setTimeSlot] = useState<TimeSlot[] | null>(null);
  const [currentTimeslot, setCurrentTimeslot] = useState<TimeSlot | null>(null);
  const [currentDate, setCurrentDate] = useState<Date>(new Date());
  const [patch, setPatch] = useState<PatchBody>({
    data: [],
    timeSlotId: -1,
    userId: -1,
    groupId: Number(params.id),
    date: currentDate,
  });

  const getPresence = (
    student: StudentWithPresence
  ): PresenceState | undefined => {
    // check patch data first then check student presence
    const presence = patch.data.find(data => data.studentId === student.id);

    if (presence) {
      return presence.state;
    }

    if (!currentTimeslot) return;

    return student.presence.find(
      presence => presence.timeSlotId === currentTimeslot.id
    )?.state;
  };

  useEffect(() => {
    if (!session || !session.data) return;

    setPatch({
      ...patch,
      userId: session.data.user.id,
    });
  }, [session]);

  useEffect(() => {
    fetch('/api/timeSlot')
      .then(res => res.json())
      .then(data => {
        setTimeSlot(data.data);
        const now = new Date();
        const current =
          data.data.find((slot: TimeSlot) => {
            const start = slot.startTime;
            const end = slot.endTime;
            const [startHour, startMinute] = start.split(':').map(Number);
            const [endHour, endMinute] = end.split(':').map(Number);
            const startSlot = new Date();
            startSlot.setHours(startHour, startMinute);
            const endSlot = new Date();
            endSlot.setHours(endHour, endMinute);

            return now >= startSlot && now <= endSlot;
          }) ?? data.data[0];

        setCurrentTimeslot(current);
        setPatch({
          ...patch,
          timeSlotId: current.id,
        });
      });
  }, []);

  useEffect(() => {
    setPatch({
      ...patch,
      data: [],
      date: currentDate,
      timeSlotId: currentTimeslot?.id ?? -1,
    });

    fetch(`/api/group/${params.id}`, {
      body: JSON.stringify({
        currentTimeslot,
        date: currentDate,
      }),
      method: 'POST',
    })
      .then(res => res.json())
      .then(data => {
        if (data.error) {
          throw new Error(data.error);
        }
        setGroupData(data.data);
      });
  }, [currentTimeslot, currentDate]);

  useEffect(() => {
    if (!patch.data.length || patch.timeSlotId === -1 || patch.userId === -1)
      return;

    const timeout = setTimeout(() => {
      fetch('/api/presence', {
        body: JSON.stringify(patch),
        method: 'PATCH',
      })
        .then(res => res.json())
        .then(data => {
          if (data.error) throw new Error(data.error);

          setGroupData(data.data);
          setPatch({
            ...patch,
            data: [],
          });
          toast({
            kind: 'success',
            message: tPage('toast.success'),
          });
        });

      // 1000ms = 1s
    }, 500);

    return () => clearTimeout(timeout);
  }, [patch]);

  if (!session) return null;

  const handleTimeSlotChange = (kind: 'prev' | 'next') => {
    if (!timeSlot || !currentTimeslot) return;

    const currentIndex = timeSlot.findIndex(
      slot => slot.id === currentTimeslot.id
    );

    kind === 'prev'
      ? setCurrentTimeslot(timeSlot[currentIndex - 1])
      : setCurrentTimeslot(timeSlot[currentIndex + 1]);
  };

  const handleStudentClick = (
    student: StudentWithPresence,
    state: PresenceState = 'PRESENT'
  ) => {
    if (!currentTimeslot) return;

    setPatch(prevPatch => ({
      ...prevPatch,
      data: [
        ...prevPatch.data.filter(data => data.studentId !== student.id),
        {
          id: student.presence.find(
            presence => presence.timeSlotId === currentTimeslot.id
          )?.id,
          studentId: student.id,
          state,
        },
      ],
    }));
  };

  if (!groupData) return <BaseLayout title={tShared('loading')} />;

  return (
    <BaseLayout
      title={groupData.name}
      description={
        groupData.StudentGroup.length === 0 ? tPage('noStudents') : undefined
      }
      sectionClassName={styles.studentList}
      actions={
        currentTimeslot &&
        timeSlot &&
        groupData.StudentGroup.length > 0 && (
          <Selector
            name={
              currentTimeslot.name ??
              `${currentTimeslot.startTime} - ${currentTimeslot.endTime}`
            }
            onChange={handleTimeSlotChange}
            disabledNext={
              currentTimeslot?.id === timeSlot[timeSlot.length - 1].id
            }
            disabledPrev={currentTimeslot?.id === timeSlot[0].id}
            onDateChange={date => setCurrentDate(date)}
            selectedDate={currentDate}
          />
        )
      }
    >
      {groupData.StudentGroup.length > 0 &&
        groupData.StudentGroup.map(studentGroup => (
          <StudentCard
            key={studentGroup.student.id}
            student={{
              firstName: studentGroup.student.firstName,
              lastName: studentGroup.student.lastName,
              className: studentGroup.student.class?.name,
            }}
            image={`http://localhost:3000/api/content/student-picture/${studentGroup.student.id}`}
            actions={[
              {
                kind:
                  getPresence(studentGroup.student) === 'PRESENT'
                    ? 'solid'
                    : 'outline',
                variant: 'success',
                children: (
                  <>
                    <ThumbsUpIcon />
                    {tShared('presenceState.present')}
                  </>
                ),
                onClick: () =>
                  handleStudentClick(studentGroup.student, 'PRESENT'),
              },
              {
                kind:
                  getPresence(studentGroup.student) === 'ABSENT'
                    ? 'solid'
                    : 'outline',
                variant: 'danger',
                children: (
                  <>
                    <UserXIcon />
                    {tShared('presenceState.absent')}
                  </>
                ),
                onClick: () =>
                  handleStudentClick(studentGroup.student, 'ABSENT'),
              },
              {
                kind:
                  getPresence(studentGroup.student) === 'LATE'
                    ? 'solid'
                    : 'outline',
                variant: 'warning',
                children: (
                  <>
                    <HourglassIcon />
                    {tShared('presenceState.late')}
                  </>
                ),
                onClick: () => handleStudentClick(studentGroup.student, 'LATE'),
              },
            ]}
          />
        ))}
    </BaseLayout>
  );
};

export default Page;
