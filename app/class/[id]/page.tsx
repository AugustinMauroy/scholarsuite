'use client';
import { useState, useEffect } from 'react';
import StudentCard from '@/components/Student/StudentCard';
import BaseLayout from '@/components/Layout/Base';
import Selector from '@/components/TimeSlot/Selector';
import styles from './page.module.css';
import type { FC } from 'react';
import type { Student, Class, TimeSlot } from '@prisma/client';

type PageProps = {
  params: { id: string };
};

type ClassWithStudents = Class & {
  students: Student[];
};

const Page: FC<PageProps> = ({ params }) => {
  const [data, setData] = useState<ClassWithStudents | null>(null);
  const [timeSlot, setTimeSlot] = useState<TimeSlot[] | null>(null);
  const [currentTimeslot, setCurrentTimeslot] = useState<TimeSlot | null>(null);

  useEffect(() => {
    fetch(`http://localhost:3000/api/class/${params.id}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    })
      .then(response => response.json())
      .then(data => setData(data.data));

    fetch('http://localhost:3000/api/timeSlot', {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    })
      .then(response => response.json())
      .then(data => {
        setTimeSlot(data.data);
        setCurrentTimeslot(data.data[0]);

        // time slot is XX:XX start - XX:XX end
        // is string, so we need to split it
        const now = new Date();
        const currentTimeslot = data.data.find((slot: TimeSlot) => {
          const start = slot.startTime;
          const end = slot.endTime;
          const [startHour, startMinute] = start.split(':').map(Number);
          const [endHour, endMinute] = end.split(':').map(Number);
          const startSlot = new Date();
          startSlot.setHours(startHour, startMinute);
          const endSlot = new Date();
          endSlot.setHours(endHour, endMinute);

          return now >= startSlot && now <= endSlot;
        });

        setCurrentTimeslot(currentTimeslot);
      });
  }, []);

  const handleTimeSlotChange = (kind: 'prev' | 'next') => {
    if (!timeSlot) return;

    const currentIndex = timeSlot.findIndex(
      slot => slot.id === currentTimeslot?.id
    );
    const nextIndex = kind === 'next' ? currentIndex + 1 : currentIndex - 1;

    if (nextIndex < 0 || nextIndex >= timeSlot.length) return;

    setCurrentTimeslot(timeSlot[nextIndex]);
  };

  return (
    <BaseLayout
      title={data?.name ?? 'Loading...'}
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
          />
        )
      }
    >
      {data?.students.map(student => (
        <StudentCard
          key={student.id}
          firstName={student.firstName}
          lastName={student.lastName}
          image={`http://localhost:3000/api/content/student-picture/${student.id}`}
          // @TODO
          onClick={undefined}
          onContextMenu={undefined}
        />
      ))}
    </BaseLayout>
  );
};

export default Page;
