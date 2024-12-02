import prisma from '@/lib/prisma';
import type { Attendance, AcademicYear } from '@prisma/client';
import type { PatchBody } from '@/types/attendance';

/**
 * A function that count the number of timeslotPeriods covered by an absencePeriod
 *
 * @todo: Implement this function
 */
export const countTimeslotPeriodsCoveredByAbsencePeriod = async (
  absencePeriodId: number
): Promise<number> => {
  const absencePeriod = await prisma.absencePeriod.findUnique({
    where: { id: absencePeriodId },
    include: {
      FirstAbsence: true,
      LastAbsence: true,
    },
  });

  if (!absencePeriod) throw new Error('AbsencePeriod not found');

  // Get whole attendance with state "ABSENT" during the absencePeriod
  const attendance = await prisma.attendance.findMany({
    where: {
      state: 'ABSENT',
      studentId: absencePeriod.studentId,
      date: {
        // FirstAbsence.date >= date >= LastAbsence.date
        gte: absencePeriod.FirstAbsence.date,
        lte: absencePeriod.LastAbsence.date,
      },
    },
    include: {
      TimeSlot: {
        include: {
          TimeSlotGroup: true,
        },
      },
    },
    orderBy: {
      date: 'asc',
    },
  });

  if (!attendance || attendance.length === 0)
    throw new Error('No attendance found during the absencePeriod');

  // Count the number of timeSlotGoup covered by the absencePeriod
  // an array of a second array with first item id of timeSlotGroup and second date of attendance
  const count: [number, Date][] = [];
  for (let i = 0; i < attendance.length; i++) {
    const timeSlotGroup = attendance[i].TimeSlot.TimeSlotGroup;

    if (
      count.length === 0 ||
      count[count.length - 1][0] !== timeSlotGroup.id ||
      count[count.length - 1][1].getDate() !== attendance[i].date.getDate() ||
      count[count.length - 1][1].getMonth() !== attendance[i].date.getMonth() ||
      count[count.length - 1][1].getFullYear() !==
        attendance[i].date.getFullYear()
    )
      count.push([timeSlotGroup.id, attendance[i].date]);
  }

  return count.length;
};

type createAbsencePeriodProps = {
  item: PatchBody['data'][0];
  currentAttendance: Attendance;
  academicYear: AcademicYear;
};

export function createAbsencePeriod({
  currentAttendance,
  item,
  academicYear,
}: createAbsencePeriodProps) {
  return prisma.absencePeriod.create({
    data: {
      FirstAbsence: {
        connect: {
          id: currentAttendance.id,
        },
      },
      LastAbsence: {
        connect: {
          id: currentAttendance.id,
        },
      },
      Student: {
        connect: {
          id: item.studentId,
        },
      },
      AcademicYear: {
        connect: {
          id: academicYear.id,
        },
      },
    },
  });
}
