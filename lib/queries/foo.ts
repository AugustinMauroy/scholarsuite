/**
 * @NOTE: ACTIVE DEVELOPMENT
 */
import prisma from "@/lib/prisma";
import { countTimeslotPeriodsCoveredByAbsencePeriod } from "@/lib/queries/absencePeriod";

export const foo = async (
  justificationPeriodId: number,
) => {
  const justificationPeriod = await prisma.justificationPeriod.findUnique({
    where: {
      id: justificationPeriodId,
    },
  });

  if (!justificationPeriod)
    throw new Error("JustificationPeriod not found");

  /**
   * get all absencePeriods hit by the JustificationPeriod
   */
  const absencePeriods = await prisma.absencePeriod.findMany({
    where: {
      studentId: justificationPeriod.studentId,
      academicYearId: justificationPeriod.academicYearId,
      OR: [
        {
          FirstAbsence: {
            date: {
              gte: justificationPeriod.startDate,
              lte: justificationPeriod.endDate,
            },
          },
        },
        {
          LastAbsence: {
            date: {
              gte: justificationPeriod.startDate,
              lte: justificationPeriod.endDate,
            },
          },
        },
      ],
    },
    include: {
      FirstAbsence: true,
      LastAbsence: true,
    },
  });

  // absencePeriodsId | count
  const summarise = new Map<number, number>();
  for (const absencePeriod of absencePeriods) {
    const count = await countTimeslotPeriodsCoveredByAbsencePeriod(
      absencePeriod.id
    );

    summarise.set(absencePeriod.id, count);
  }
};
