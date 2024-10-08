import prisma from './prisma.ts';

export const purgeAllCache = async () =>
  await Promise.all([
    await prisma.cacheAbsencePeriodTimeSlotGroups.deleteMany(),
  ]);
