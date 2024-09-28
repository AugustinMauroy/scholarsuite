import { AbsencePeriodStatus } from '@prisma/client';
import prisma from '@/lib/prisma';

export const POST = async (req: Request): Promise<Response> => {
  const { groupId, selectedStatus, page } = (await req
    .json()
    .catch(() => ({}))) as {
    groupId: string;
    selectedStatus: AbsencePeriodStatus;
    page: number;
  };

  const status = selectedStatus ?? AbsencePeriodStatus.PENDING;
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
    },
    include: {
      Student: {
        include: {
          Class: true,
        },
      },
      AcademicYear: true,
      FirstAbsence: true,
      LastAbsence: true,
      NextPresence: true,
    },
    skip: skip,
    take: itemsPerPage,
  });

  return Response.json({ data: absencePeriods });
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
