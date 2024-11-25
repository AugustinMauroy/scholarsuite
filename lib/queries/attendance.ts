import prisma from '@/lib/prisma';
import type { TimeSlot } from '@prisma/client';
import type { PatchBody } from '@/types/attendance';

type GetAttendanceProps = {
  item: PatchBody['data'][0];
  currentTimeSlot: TimeSlot;
  date: Date;
};

export function getCurrentAttendance({
  item,
  currentTimeSlot,
  date,
}: GetAttendanceProps) {
  return prisma.attendance.findFirst({
    where: {
      date: {
        gte: new Date(date.getFullYear(), date.getMonth(), date.getDate()),
        lt: new Date(date.getFullYear(), date.getMonth(), date.getDate() + 1),
      },
      timeSlotId: currentTimeSlot.id,
      studentId: item.studentId,
    },
  });
}
