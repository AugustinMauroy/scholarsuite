'use client';
import { useState, useEffect } from 'react';
import StudentCard from '@/components/Student/StudentCard';
import BaseLayout from '@/components/Layout/Base';
import Selector from '@/components/timeSlot/Selector';
import styles from './page.module.css';
import type { FC } from 'react';
import type {
  Student,
  Class,
  TimeSlot,
  Presence,
  PresenceState,
} from '@prisma/client';
import type { PatchBody } from '@/types/presence';

type PageProps = {
  params: { id: string };
};

type StudentWithPresence = Student & { Presence: Presence[] };

type ClassWithStudents = Class & {
  students: StudentWithPresence[];
};

const Page: FC<PageProps> = ({ params }) => {
  const [classData, setClassData] = useState<ClassWithStudents | null>(null);
  const [timeSlot, setTimeSlot] = useState<TimeSlot[] | null>(null);
  const [currentTimeslot, setCurrentTimeslot] = useState<TimeSlot | null>(null);
  const [currentDate, setCurrentDate] = useState<Date>(new Date());
  const [patch, setPatch] = useState<PatchBody>({
    data: [],
    timeSlotId: -1,
    userId: 1,
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

    return student.Presence.find(
      presence => presence.timeSlotId === currentTimeslot.id
    )?.state;
  };

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

    fetch(`/api/class/${params.id}`, {
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
        setClassData(data.data);
      });
  }, [currentTimeslot, currentDate]);

  useEffect(() => {
    if (!patch.data.length || patch.timeSlotId === -1) return;

    const timeout = setTimeout(() => {
      fetch('/api/presence', {
        body: JSON.stringify(patch),
        method: 'PATCH',
      })
        .then(res => res.json())
        .then(data => {
          if (data.error) {
            throw new Error(data.error);
          }
          setClassData(prev => {
            if (!prev) return prev;

            return {
              ...prev,
              students: prev.students.map(student => {
                const presence = data.data.find(
                  (presence: Presence) => presence.studentId === student.id
                );

                if (!presence) return student;

                return {
                  ...student,
                  Presence: [
                    ...student.Presence.filter(
                      p => p.timeSlotId !== presence.timeSlotId
                    ),
                    presence,
                  ],
                };
              }),
            };
          });
          setPatch({
            ...patch,
            data: [],
          });
        });

      // 1000ms = 1s
    }, 1000);

    return () => clearTimeout(timeout);
  }, [patch]);

  if (!classData) return <BaseLayout title="Loading..." />;

  const handleTimeSlotChange = (kind: 'prev' | 'next') => {
    if (!timeSlot || !currentTimeslot) return;

    const currentIndex = timeSlot.findIndex(
      slot => slot.id === currentTimeslot.id
    );

    kind === 'prev'
      ? setCurrentTimeslot(timeSlot[currentIndex - 1])
      : setCurrentTimeslot(timeSlot[currentIndex + 1]);
  };

  const handleStudentClick = (student: StudentWithPresence) => {
    if (!currentTimeslot) return;

    setPatch({
      ...patch,
      data: [
        ...patch.data.filter(data => data.studentId !== student.id),
        {
          id: student.Presence.find(
            presence => presence.timeSlotId === currentTimeslot.id
          )?.id,
          studentId: student.id,
          state: 'PRESENT',
        },
      ],
    });
  };

  const handleStudentContextMenu = (student: StudentWithPresence) => {
    if (!currentTimeslot) return;

    setPatch(prev => {
      const state = student.Presence.find(
        presence => presence.timeSlotId === currentTimeslot.id
      )?.state;

      const presence = prev.data.find(data => data.studentId === student.id);

      if (presence) {
        return {
          ...prev,
          data: [
            ...prev.data.filter(data => data.studentId !== student.id),
            {
              studentId: student.id,
              state:
                presence.state === 'PRESENT'
                  ? 'ABSENT'
                  : presence.state === 'ABSENT'
                    ? 'LATE'
                    : 'ABSENT',
            },
          ],
        };
      }

      return {
        ...prev,
        data: [
          ...prev.data.filter(data => data.studentId !== student.id),
          {
            id: student.Presence.find(
              presence => presence.timeSlotId === currentTimeslot.id
            )?.id,
            studentId: student.id,
            state:
              state === 'PRESENT'
                ? 'ABSENT'
                : state === 'ABSENT'
                  ? 'LATE'
                  : 'ABSENT',
          },
        ],
      };
    });
  };

  return (
    <BaseLayout
      title={classData.name}
      sectionClassName={styles.studentList}
      actions={
        currentTimeslot &&
        timeSlot && (
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
      {classData?.students.map(student => (
        <StudentCard
          key={student.id}
          firstName={student.firstName}
          lastName={student.lastName}
          state={getPresence(student)}
          image={`http://localhost:3000/api/content/student-picture/${student.id}`}
          onClick={() => handleStudentClick(student)}
          onContextMenu={() => handleStudentContextMenu(student)}
        />
      ))}
    </BaseLayout>
  );
};

export default Page;
