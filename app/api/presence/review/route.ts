import { getServerSession } from 'next-auth';
import nextAuthConfig from '@/lib/auth';
import prisma from '@/lib/prisma';

/**
 * Get all presences we select all students under the tutelage using class
 * because groups can represent multiple classes and we want to be able to
 */
export const POST = async (req: Request): Promise<Response> => {
  const session = await getServerSession(nextAuthConfig);

  if (!session)
    return Response.json({ error: 'Unauthorized' }, { status: 401 });

  const { pagination } = await req.json().catch(() => ({}));

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

  const query = {
    where: {
      OR: [
        {
          state: 'ABSENT',
        },
        {
          state: 'LATE',
        },
        {
          state: 'EXCUSED',
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
      PresenceAudit: {
        include: {
          changedByUser: true,
          user: true,
        },
        orderBy: {
          changedAt: 'desc',
        },
      },
    },
    orderBy: [{ processed: 'asc' }, { createdAt: 'asc' }],
    skip: pagination?.page * pagination?.limit,
    take: pagination?.limit,
  } as any;

  const data = await prisma.presence.findMany(query);
  const max = await prisma.presence.count({ where: query.where });

  // not processed first then processed then excused last
  data.sort((a, b) => {
    if (a.processed === b.processed) {
      if (a.state === b.state) {
        return 0;
      }

      return a.state === 'EXCUSED' ? 1 : -1;
    }

    return a.processed ? 1 : -1;
  });

  return Response.json({ data, max }, { status: 200 });
};

export const PATCH = async (req: Request): Promise<Response> => {
  const { id, processed, state } = (await req.json()) as {
    id: number;
    processed?: boolean;
    state?: string;
  };

  const data = {} as any;

  if (processed !== undefined) data['processed'] = processed;
  if (state !== undefined) data['state'] = state;

  console.log(data);

  const presence = await prisma.presence.update({
    where: { id },
    data: data,
  });

  return Response.json({ data: presence }, { status: 200 });
};
