import { AbsencePeriodStatus } from '@prisma/client';
import prisma from '@/lib/prisma';

export const POST = async (req: Request): Promise<Response> => {
  const { groupId, selectedStatus } = (await req.json().catch(() => ({}))) as {
    groupId: string;
    selectedStatus: AbsencePeriodStatus;
  };

  const status = selectedStatus ?? AbsencePeriodStatus.PENDING;

  if (!groupId || Number.isNaN(Number(groupId)))
    Response.json({ error: 'Group ID i required' }, { status: 400 });

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
  });

  return Response.json({ data: absencePeriods });
};
