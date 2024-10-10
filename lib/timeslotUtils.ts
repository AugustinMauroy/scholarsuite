import prisma from './prisma';

export async function calculateTimeSlotGroupsInAbsencePeriod(
  absencePeriodId: number
): Promise<number> {
  const absencePeriod = await prisma.absencePeriod.findUnique({
    where: { id: absencePeriodId },
    include: {
      FirstAbsence: {
        include: {
          TimeSlot: true,
        },
      },
      LastAbsence: {
        include: {
          TimeSlot: true,
        },
      },
    },
  });

  if (!absencePeriod) {
    throw new Error('AbsencePeriod not found');
  }

  const attendanceIds = [
    absencePeriod.firstAbsenceId,
    ...(
      await prisma.absencePeriod.findMany({
        where: { firstAbsenceId: absencePeriod.firstAbsenceId },
        select: { lastAbsenceId: true },
      })
    ).map(absencePeriod => absencePeriod.lastAbsenceId),
    absencePeriod.lastAbsenceId,
  ].flat() as number[];

  const timeSlots = await prisma.attendance.findMany({
    where: {
      id: {
        in: attendanceIds,
      },
    },
    select: {
      TimeSlot: {
        select: {
          timeSlotGroupId: true,
        },
      },
    },
  });

  const timeSlotGroups = timeSlots.map(
    attendance => attendance.TimeSlot?.timeSlotGroupId ?? 0
  );
  const uniqueTimeSlotGroups = new Set(timeSlotGroups);

  return uniqueTimeSlotGroups.size;
}
