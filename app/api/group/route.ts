import prisma from '@/lib/prisma';

export const GET = async (req: Request) => {
  const groups = await prisma.group.findMany({
    include: {
      subject: true,
    },
  });

  return Response.json(
    {
      data: groups,
    },
    { status: 200 }
  );
};

export const PUT = async (req: Request) => {
  const { name, schoolLevelId, subjectId } = await req.json().catch(() => ({}));

  if (!name || !schoolLevelId || !subjectId)
    return Response.json({ error: 'All fields are required' }, { status: 400 });

  const groups = await prisma.group.create({
    data: {
      name,
      schoolLevelId,
      subjectId,
    },
    include: {
      subject: true,
    },
  });

  return Response.json({ data: groups }, { status: 201 });
};

export const PATCH = async (req: Request) => {
  const { id, name, schoolLevelId, subjectId } = await req
    .json()
    .catch(() => ({}));

  if (!id || !name || !schoolLevelId || !subjectId)
    return Response.json({ error: 'All fields are required' }, { status: 400 });

  const groups = await prisma.group.update({
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
    },
  });

  return Response.json({ data: groups }, { status: 200 });
};