import prisma from '@/lib/prisma';

export const POST = async (req: Request): Promise<Response> => {
  const { groupId } = await req.json().catch(() => ({}));

  if (!groupId)
    Response.json({ error: 'Group ID is required' }, { status: 400 });

  const studentIds = await prisma.student
    .findMany({
      where: {
        StudentGroup: {
          some: {
            id: groupId,
          },
        },
      },
      select: {
        id: true,
      },
    })
    .then(students => students.map(student => student.id));

  const absencePeriods = await prisma.absencePeriod.findMany({
    where: {
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
