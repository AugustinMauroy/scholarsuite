import { getServerSession } from 'next-auth';
import prisma from '@/lib/prisma';
import nextAuthConfig from '@/lib/auth';
import type { SchoolLevel } from '@prisma/client';

export const GET = async (req: Request) => {
  const schoolLevels = await prisma.schoolLevel.findMany({
    orderBy: {
      order: 'asc',
    },
  });

  return Response.json({
    data: schoolLevels,
  });
};

export const PUT = async (req: Request) => {
  const session = await getServerSession(nextAuthConfig);
  if (!session || session.user.role !== 'ADMIN')
    return Response.json({ error: 'Unauthorized' }, { status: 401 });

  const schoolLevel = (await req.json()) as SchoolLevel;

  const newSchoolLevel = await prisma.schoolLevel.create({
    data: schoolLevel,
  });

  return Response.json({
    data: newSchoolLevel,
  });
};

export const PATCH = async (req: Request) => {
  const session = await getServerSession(nextAuthConfig);
  if (!session || session.user.role !== 'ADMIN')
    return Response.json({ error: 'Unauthorized' }, { status: 401 });

  const { id, order, ...schoolLevelData } = (await req.json()) as SchoolLevel;

  if (!id) {
    return Response.json({ error: 'Missing id' }, { status: 400 });
  }

  const currentSchoolLevel = await prisma.schoolLevel.findUnique({
    where: {
      id,
    },
  });

  if (!currentSchoolLevel) {
    return Response.json({ error: 'School level not found' }, { status: 404 });
  }

  // reordering
  if (order !== currentSchoolLevel.order) {
    if (order < currentSchoolLevel.order) {
      await prisma.schoolLevel.updateMany({
        where: {
          AND: [
            {
              order: {
                gte: order,
              },
            },
            {
              order: {
                lt: currentSchoolLevel.order,
              },
            },
          ],
        },
        data: {
          order: {
            increment: 1,
          },
        },
      });
    }

    if (order > currentSchoolLevel.order) {
      await prisma.schoolLevel.updateMany({
        where: {
          AND: [
            {
              order: {
                lte: order,
              },
            },
            {
              order: {
                gt: currentSchoolLevel.order,
              },
            },
          ],
        },
        data: {
          order: {
            decrement: 1,
          },
        },
      });
    }

    await prisma.schoolLevel.update({
      where: {
        id,
      },
      data: {
        order,
      },
    });

    return Response.json({
      data: currentSchoolLevel,
    });
  }

  const updatedSchoolLevel = await prisma.schoolLevel.update({
    where: {
      id,
    },
    data: schoolLevelData,
  });

  return Response.json({
    data: updatedSchoolLevel,
  });
};
