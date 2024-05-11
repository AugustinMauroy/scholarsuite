import { isPossible } from '@/utils/academicYear';
import prisma from '@/lib/prisma';

export const GET = async (req: Request): Promise<Response> => {
  const academicYears = await prisma.academicYear.findMany();

  return Response.json({ data: academicYears }, { status: 200 });
};

export const PATCH = async (req: Request): Promise<Response> => {
  const { id, name, startDate, endDate } = await req.json();

  if (!name || !startDate || !endDate) {
    return Response.json(
      { error: 'Academic year cannot be empty' },
      { status: 400 }
    );
  }
  if (!isPossible(startDate, endDate)) {
    return Response.json({ error: 'Invalid date format' }, { status: 400 });
  }

  const academicYear = await prisma.academicYear.update({
    where: {
      id,
    },
    data: {
      name,
      startDate: new Date(startDate),
      endDate: new Date(endDate),
    },
  });

  return Response.json({ data: academicYear }, { status: 200 });
};

export const PUT = async (req: Request): Promise<Response> => {
  const { name, startDate, endDate } = await req.json();

  if (!name || !startDate || !endDate) {
    return Response.json(
      { error: 'Academic year cannot be empty' },
      { status: 400 }
    );
  }
  if (!isPossible(startDate, endDate)) {
    return Response.json({ error: 'Invalid date format' }, { status: 400 });
  }

  const academicYear = await prisma.academicYear.create({
    data: {
      name,
      startDate: new Date(startDate),
      endDate: new Date(endDate),
    },
  });

  return Response.json({ data: academicYear }, { status: 201 });
};
