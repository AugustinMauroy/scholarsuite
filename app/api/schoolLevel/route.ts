import { getServerSession } from 'next-auth';
import prisma from '@/lib/prisma';
import nextAuthConfig from '@/lib/auth';
import type { SchoolLevel } from '@prisma/client';

export const GET = async (req: Request) => {
  const schoolLevels = await prisma.schoolLevel.findMany();

  return Response.json({
    data: schoolLevels,
  });
};

export const PUT = async (req: Request) => {
  const session = await getServerSession(nextAuthConfig);
  if (!session || session.user.role !== 0)
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
  if (!session || session.user.role !== 0)
    return Response.json({ error: 'Unauthorized' }, { status: 401 });

  const { id, ...schoolLevel } = (await req.json()) as SchoolLevel;

  if (!id) {
    return Response.json({ error: 'Missing id' }, { status: 400 });
  }

  const updatedSchoolLevel = await prisma.schoolLevel.update({
    where: { id },
    data: schoolLevel,
  });

  return Response.json({
    data: updatedSchoolLevel,
  });
};
