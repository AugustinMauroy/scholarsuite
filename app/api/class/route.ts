import prisma from '@/lib/prisma';

export const PUT = async (req: Request) => {
  const { name, schoolLevelId } = await req.json();

  const newclass = await prisma.class.create({
    data: {
      name,
      schoolLevelId,
    },
  });

  return Response.json({
    data: newclass,
  });
};

export const GET = async (req: Request) => {
  const classes = await prisma.class.findMany({});

  return Response.json(
    {
      data: classes,
    },
    { status: 200 }
  );
};

export const POST = async (req: Request) => {
  const { userId } = await req.json();

  if (!userId)
    return Response.json({ error: 'User ID is required' }, { status: 400 });

  const user = await prisma.user.findUnique({
    where: {
      id: userId,
    },
  });

  if (!user) return Response.json({ error: 'User not found' }, { status: 404 });

  const classes = await prisma.class.findMany({
    where: {
      userId: user.id,
    },
  });

  return Response.json(
    {
      data: classes,
    },
    { status: 200 }
  );
};
