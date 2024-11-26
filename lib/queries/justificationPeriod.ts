import prisma from '@/lib/prisma';

/**
 * Updates absence periods for a given justification period.
 *
 * This function retrieves the specified justification period and updates the absence periods
 * that are affected by this justification period. It calculates the number of groups of time slots
 * covered by the justification period and updates the counts of justified
 * and unjustified time slot group counts for each period of absence concerned.
 *
 * @todo: need to be implemented
 */
export const updateAbsencePeriodsForJustificationPeriod = async (
  justificationPeriodId: number
) => {
  const justificationPeriod = await prisma.justificationPeriod.findUnique({
    where: { id: justificationPeriodId },
  });

  if (!justificationPeriod) throw new Error('JustificationPeriod not found');

  /**
   * Steps for updating periods of absence :
   * 1. Find all the periods of absence affected by the justification period.
   * 2. iterate on these absence periods:
   *   - Count the number of groups of time slots covered by the justification period within a period of absence.
   *   - Calculate the difference between the number of groups of time slots covered by the period of absence before and after the justification period.
   *   - Update the counts of justified and non-justified slot groups for each period of absence.
   */
  const absencePeriods = await prisma.absencePeriod.findMany({
    where: {
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

  if (!absencePeriods || absencePeriods.length === 0)
    throw new Error('No absencePeriods found during the justificationPeriod');

  for (const absencePeriod of absencePeriods) {
    const { totalTimeslotGroupCount } = absencePeriod;

    if (totalTimeslotGroupCount === null)
      throw new Error('totalTimeslotGroupCount is null');

    // TODO: Calculate the timeslotGroupCount for the justificationPeriod within the absencePeriod
    const justifiedTimeslotGroupCount = await prisma.timeSlotGroup.count({
      where: {
        TimeSlot: {
          some: {
            Attendance: {
              some: {
                studentId: justificationPeriod.studentId,
                date: {
                  gte: justificationPeriod.startDate,
                  lte: justificationPeriod.endDate,
                },
                state: 'ABSENT',
              },
            },
          },
        },
      },
    });

    const unjustifiedTimeslotGroupCount =
      totalTimeslotGroupCount - justifiedTimeslotGroupCount;

    await prisma.absencePeriod.update({
      where: { id: absencePeriod.id },
      data: {
        justifiedTimeslotGroupCount,
        unjustifiedTimeslotGroupCount,
      },
    });
  }
};
