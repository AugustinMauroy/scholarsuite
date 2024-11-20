import { AbsencePeriodStatus } from '@prisma/client';
import prisma from '@/lib/prisma';
import { calculateTimeSlotGroupsInAbsencePeriod } from '@/lib/timeslotUtils';

export const POST = async (req: Request): Promise<Response> => {
  const { groupId, selectedStatus, page } = (await req
    .json()
    .catch(() => ({}))) as {
    groupId: string;
    selectedStatus: AbsencePeriodStatus;
    page: number;
  };

  const status = selectedStatus ?? AbsencePeriodStatus.OPEN;
  const itemsPerPage = 10;
  const skip = (page - 1) * itemsPerPage;

  if (!groupId || Number.isNaN(Number(groupId)))
    Response.json({ error: 'Group ID is required' }, { status: 400 });

  const students = await prisma.studentGroup.findMany({
    where: {
      groupId: Number(groupId),
    },
    select: {
      studentId: true,
    },
  });
  const studentIds = students.map(({ studentId }) => studentId);
  const absencePeriods = await prisma.absencePeriod.findMany({
    where: {
      status: status,
      studentId: {
        in: studentIds,
      },
      enabled: true,
    },
    include: {
      Student: {
        include: {
          Class: true,
        },
      },
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
    skip: skip,
    take: itemsPerPage,
  });

  const result = await Promise.all(
    absencePeriods.map(async absencePeriod => {
      const count = await calculateTimeSlotGroupsInAbsencePeriod(
        absencePeriod.id
      );

      return {
        ...absencePeriod,
        count,
      };
    })
  );

  return Response.json({ data: result });
};

export const PATCH = async (req: Request): Promise<Response> => {
  const { absencePeriodId, status } = (await req.json().catch(() => ({}))) as {
    absencePeriodId: string;
    status: AbsencePeriodStatus;
  };

  if (!absencePeriodId || Number.isNaN(Number(absencePeriodId)))
    Response.json({ error: 'Absence period ID is required' }, { status: 400 });

  if (!status) Response.json({ error: 'Status is required' }, { status: 400 });

  const updatedAbsencePeriod = await prisma.absencePeriod.update({
    where: {
      id: Number(absencePeriodId),
    },
    data: {
      status: status,
    },
  });

  return Response.json({ data: updatedAbsencePeriod });
};
