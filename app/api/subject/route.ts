import prisma from '@/lib/prisma';

export const GET = async (req: Request): Promise<Response> => {
  const subjects = await prisma.subject.findMany();

  return Response.json({ data: subjects }, { status: 200 });
};

export const PATCH = async (req: Request): Promise<Response> => {
  const { id, name, enabled } = await req.json();

  if (!name || !id) {
    return Response.json(
      { error: 'Subject name cannot be empty' },
      { status: 400 }
    );
  }

  const subject = await prisma.subject.update({
    where: {
      id,
    },
    data: {
      name,
      enabled,
    },
  });

  return Response.json({ data: subject }, { status: 200 });
};

export const PUT = async (req: Request): Promise<Response> => {
  const { name, enabled } = await req.json();

  if (!name || !enabled) {
    return Response.json(
      { error: 'Subject name cannot be empty' },
      { status: 400 }
    );
  }

  const subject = await prisma.subject.create({
    data: {
      name,
      enabled,
    },
  });

  return Response.json({ data: subject }, { status: 201 });
};
