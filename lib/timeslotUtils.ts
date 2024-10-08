import prisma from './prisma';

// 1 hour in milliseconds
const CACHE_EXPIRATION_TIME = 60 * 60 * 1000;

export async function calculateTimeSlotGroupsInAbsencePeriod(
  absencePeriodId: number
): Promise<number> {
  const cachedResult = await prisma.cacheAbsencePeriodTimeSlotGroups.findUnique(
    {
      where: { absencePeriodId },
    }
  );

  if (cachedResult && new Date(cachedResult.expiresAt) > new Date())
    return cachedResult.count;

  const absencePeriod = await prisma.absencePeriod.findUnique({
    where: { id: absencePeriodId },
    include: {
      FirstAbsence: { include: { TimeSlot: true } },
      LastAbsence: { include: { TimeSlot: true } },
    },
  });

  if (!absencePeriod) {
    throw new Error(`Absence period with id ${absencePeriodId} not found`);
  }

  const firstTimeSlotGroupId =
    absencePeriod.FirstAbsence.TimeSlot.timeSlotGroupId;
  const lastTimeSlotGroupId =
    absencePeriod.LastAbsence.TimeSlot.timeSlotGroupId;
  const lastDate = new Date(absencePeriod.LastAbsence.date);
  const firstDate = new Date(absencePeriod.FirstAbsence.date);

  if (
    firstTimeSlotGroupId === lastTimeSlotGroupId &&
    firstDate.toDateString() === lastDate.toDateString()
  ) {
    const count = 1;
    await prisma.cacheAbsencePeriodTimeSlotGroups.upsert({
      where: { absencePeriodId },
      update: {
        count,
        cachedAt: new Date(),
        expiresAt: new Date(Date.now() + CACHE_EXPIRATION_TIME),
      },
      create: {
        absencePeriodId,
        count,
        cachedAt: new Date(),
        expiresAt: new Date(Date.now() + CACHE_EXPIRATION_TIME),
      },
    });

    return count;
  }

  const attendances = await prisma.attendance.findMany({
    where: {
      state: 'ABSENT',
      date: {
        gte: new Date(absencePeriod.FirstAbsence.date),
        lte: new Date(absencePeriod.LastAbsence.date),
      },
    },
    include: {
      TimeSlot: true,
    },
    orderBy: {
      date: 'asc',
    },
  });

  let count = 0;

  for (let i = 0; i < attendances.length; i++) {
    if (
      attendances[i].TimeSlot.timeSlotGroupId !==
      attendances[i - 1]?.TimeSlot.timeSlotGroupId
    ) {
      count++;
    }
  }

  await prisma.cacheAbsencePeriodTimeSlotGroups.upsert({
    where: { absencePeriodId },
    update: {
      count,
      cachedAt: new Date(),
      expiresAt: new Date(Date.now() + CACHE_EXPIRATION_TIME),
    },
    create: {
      absencePeriodId,
      count,
      cachedAt: new Date(),
      expiresAt: new Date(Date.now() + CACHE_EXPIRATION_TIME),
    },
  });

  return count;
}
