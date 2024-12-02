'use client';
import { ThumbsUpIcon, UserXIcon, HourglassIcon } from 'lucide-react';
import { useSession } from 'next-auth/react';
import { useTranslations } from 'next-intl';
import { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import BaseLayout from '@/components/Layout/Base';
import StudentCard from '@/components/Student/StudentCard';
import Selector from '@/components/TimeSlot/Selector';
import { useToast } from '@/hooks/useToast';
import styles from './page.module.css';
import type { PatchBody } from '@/types/attendance';
import type {
  Student,
  Group,
  TimeSlot,
  Attendance,
  AttendanceState,
  Class,
} from '@prisma/client';
import type { FC } from 'react';

type StudentWithAttendance = Student & {
  Attendance: Attendance[];
  Class: Class | null;
};

type GroupWithStudents = Group & {
  StudentGroup: {
    Student: StudentWithAttendance;
  }[];
};

const Page: FC = () => {
  const id = Number(useParams().id);
  const tPage = useTranslations('app.groupAttendance');
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
    groupId: Number(id),
    date: currentDate,
  });

  const getAttendance = (
    student: StudentWithAttendance
  ): AttendanceState | undefined => {
    // check patch data first then check student attendance
    const attendance = patch.data.find(data => data.studentId === student.id);

    if (attendance) {
      return attendance.state;
    }

    if (!currentTimeslot) return;

    return student.Attendance.find(
      attendance => attendance.timeSlotId === currentTimeslot.id
    )?.state;
  };

  useEffect(() => {
    if (!session || !session.data) return;

    setPatch({
      ...patch,
      userId: session.data.user.id,
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
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
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    setPatch({
      ...patch,
      data: [],
      date: currentDate,
      timeSlotId: currentTimeslot?.id ?? -1,
    });

    fetch(`/api/group/${id}`, {
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
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentTimeslot, currentDate]);

  useEffect(() => {
    if (!patch.data.length || patch.timeSlotId === -1 || patch.userId === -1)
      return;

    const timeout = setTimeout(() => {
      fetch('/api/attendance', {
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
            duration: 1000,
            message: tPage('toast.success'),
          });
        });
    }, 500);

    return () => clearTimeout(timeout);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [patch]);

  if (!session) return null;

  const handleTimeSlotChange = (kind: 'prev' | 'next') => {
    if (!timeSlot || !currentTimeslot) return;

    const currentIndex = timeSlot.findIndex(
      slot => slot.id === currentTimeslot.id
    );

    if (kind === 'prev') setCurrentTimeslot(timeSlot[currentIndex - 1]);
    else setCurrentTimeslot(timeSlot[currentIndex + 1]);
  };

  const handleStudentClick = (
    student: StudentWithAttendance,
    state: AttendanceState = 'PRESENT'
  ) => {
    if (!currentTimeslot) return;

    setPatch(prevPatch => ({
      ...prevPatch,
      data: [
        ...prevPatch.data.filter(data => data.studentId !== student.id),
        {
          id: student.Attendance.find(
            attendance => attendance.timeSlotId === currentTimeslot.id
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
      title={groupData.name ?? groupData.ref}
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
            withMore
            from={`/group-attendance/${id}`}
            key={studentGroup.Student.id}
            student={studentGroup.Student as Student}
            actions={[
              {
                kind:
                  getAttendance(studentGroup.Student) === 'PRESENT'
                    ? 'solid'
                    : 'outline',
                variant: 'success',
                children: (
                  <>
                    <ThumbsUpIcon />
                    {tShared('attendanceState.present')}
                  </>
                ),
                onClick: () =>
                  handleStudentClick(studentGroup.Student, 'PRESENT'),
              },
              {
                kind:
                  getAttendance(studentGroup.Student) === 'ABSENT'
                    ? 'solid'
                    : 'outline',
                variant: 'danger',
                children: (
                  <>
                    <UserXIcon />
                    {tShared('attendanceState.absent')}
                  </>
                ),
                onClick: () =>
                  handleStudentClick(studentGroup.Student, 'ABSENT'),
              },
              {
                kind:
                  getAttendance(studentGroup.Student) === 'LATE'
                    ? 'solid'
                    : 'outline',
                variant: 'warning',
                children: (
                  <>
                    <HourglassIcon />
                    {tShared('attendanceState.late')}
                  </>
                ),
                onClick: () => handleStudentClick(studentGroup.Student, 'LATE'),
              },
            ]}
          />
        ))}
    </BaseLayout>
  );
};

export default Page;
