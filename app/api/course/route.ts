import prisma from '@/lib/prisma';

export const GET = async (req: Request) => {
  const courses = await prisma.course.findMany({
    include: {
      subject: true,
      schoolLevel: true,
    },
  });

  return Response.json(
    {
      data: courses,
    },
    { status: 200 }
  );
};

export const PUT = async (req: Request) => {
  const { name, schoolLevelId, subjectId } = await req.json().catch(() => ({}));

  if (!name || !schoolLevelId || !subjectId)
    return Response.json({ error: 'All fields are required' }, { status: 400 });

  const course = await prisma.course.create({
    data: {
      name,
      schoolLevelId,
      subjectId,
    },
    include: {
      subject: true,
      schoolLevel: true,
    },
  });

  return Response.json({ data: course }, { status: 201 });
};

export const PATCH = async (req: Request) => {
  const { id, name, schoolLevelId, subjectId } = await req
    .json()
    .catch(() => ({}));

  if (!id || !name || !schoolLevelId || !subjectId)
    return Response.json({ error: 'All fields are required' }, { status: 400 });

  const course = await prisma.course.update({
    where: {
      id,
    },
    data: {
      name,
      schoolLevelId,
      subjectId,
    },
    include: {
      subject: true,
      schoolLevel: true,
    },
  });

  return Response.json({ data: course }, { status: 200 });
};
