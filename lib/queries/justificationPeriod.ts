import prisma from "@/lib/prisma";


export const countTimeslotPeriodsCoveredByJustificationPeriod = async (
  justificationPeriodId: number
): Promise<number> => {
  const justificationPeriod = await prisma.justificationPeriod.findUnique({
    where: { id: justificationPeriodId },
  });

  if (!justificationPeriod) throw new Error('JustificationPeriod not found');

};
