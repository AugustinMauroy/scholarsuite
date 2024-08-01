import { getServerSession } from 'next-auth';
import nextAuthConfig from '@/lib/auth';
import prisma from '@/lib/prisma';
import type { PatchBody } from '@/types/presence';

export const GET = async (req: Request): Promise<Response> => {
  const session = await getServerSession(nextAuthConfig);

  if (!session)
    return Response.json({ error: 'Unauthorized' }, { status: 401 });

  const currentAcademicYear = await prisma.academicYear.findFirst({
    where: {
      startDate: {
        lte: new Date(),
      },
      endDate: {
        gte: new Date(),
      },
    },
  });

  if (!currentAcademicYear)
    return Response.json({ error: 'No academic year found' }, { status: 404 });

  const userWithClasses = await prisma.user.findUnique({
    where: {
      id: session.user.id,
    },
    include: {
      userClass: {
        include: {
          class: {
            include: {
              students: true,
            },
          },
        },
      },
    },
  });

  if (!userWithClasses)
    return Response.json({ error: 'User not found' }, { status: 404 });

  const studentIdsUnderTutelage = userWithClasses.userClass
    .flatMap(cu => cu.class.students)
    .map(s => s.id);

  const data = await prisma.presence.findMany({
    where: {
      OR: [
        {
          state: 'ABSENT',
        },
        {
          state: 'LATE',
        },
      ],
      studentId: {
        in: studentIdsUnderTutelage,
      },
      academicYearId: currentAcademicYear.id,
    },
    include: {
      student: {
        include: {
          class: true,
        },
      },
      timeSlot: true,
      user: true,
    },
    orderBy: {
      processed: 'asc',
    },
  });

  return Response.json({ data: data }, { status: 200 });
};

export const PATCH = async (req: Request): Promise<Response> => {
  const body: PatchBody = await req.json().catch(() => null);

  if (!body) {
    return Response.json({ error: 'invalid body' }, { status: 400 });
  }

  const { data, timeSlotId, userId } = body;
  const date = new Date(body.date);

  if (!data || !timeSlotId || userId === undefined || !date) {
    return Response.json({ error: 'missing required fields' }, { status: 400 });
  }

  const timeSlot = await prisma.timeSlot.findUnique({
    where: { id: timeSlotId },
  });

  if (!timeSlot) {
    return Response.json({ error: 'timeslot not found' }, { status: 404 });
  }

  const currentAcademicYear = await prisma.academicYear.findFirst({
    where: {
      startDate: {
        lte: new Date(),
      },
      endDate: {
        gte: new Date(),
      },
    },
  });

  if (!currentAcademicYear) {
    return Response.json({ error: 'no academic year found' }, { status: 404 });
  }

  if (
    date < currentAcademicYear.startDate ||
    date > currentAcademicYear.endDate
  ) {
    return Response.json(
      { error: 'date not within current academic year' },
      { status: 400 }
    );
  }

  const user = await prisma.user.findUnique({
    where: { id: userId },
  });

  if (!user) {
    return Response.json({ error: 'user not found' }, { status: 404 });
  }

  const now = new Date();
  const academicYear = await prisma.academicYear.findFirst({
    where: {
      startDate: { lte: now },
      endDate: { gte: now },
    },
  });

  if (!academicYear) {
    return Response.json({ error: 'no academic year found' }, { status: 404 });
  }

  if (date < academicYear.startDate || date > academicYear.endDate) {
    return Response.json(
      { error: 'date not within current academic year' },
      { status: 400 }
    );
  }

  for (const item of data) {
    const student = await prisma.student.findUnique({
      where: { id: item.studentId },
    });

    if (!student) {
      return Response.json({ error: 'student not found' }, { status: 404 });
    }

    const presence = await prisma.presence.findFirst({
      where: {
        date: {
          gte: new Date(date.getFullYear(), date.getMonth(), date.getDate()),
          lt: new Date(date.getFullYear(), date.getMonth(), date.getDate() + 1),
        },
        timeSlotId: timeSlot.id,
        studentId: item.studentId,
      },
    });

    if (presence) {
      await prisma.presence.update({
        where: { id: presence.id },
        data: { ...item, userId },
      });
    } else {
      await prisma.presence.create({
        data: {
          ...item,
          userId,
          timeSlotId,
          // @TODO: get groupIdId from user
          groupId: 1,
          date,
          studentId: item.studentId,
          academicYearId: academicYear.id,
        },
      });
    }
  }

  const result = await prisma.presence.findMany({
    where: {
      date: {
        gte: new Date(date),
        lt: new Date(date.getFullYear(), date.getMonth(), date.getDate() + 1),
      },
      timeSlotId,
      userId,
    },
  });

  return Response.json(
    {
      data: result,
    },
    { status: 200 }
  );
};
