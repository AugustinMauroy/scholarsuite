import prisma from '@/lib/prisma';

type Parmas = {
  params: {
    id: string;
  };
};

export const GET = async (
  req: Request,
  { params }: Parmas
): Promise<Response> => {
  const { id } = params;

  const classData = await prisma.class.findUnique({
    where: {
      id: parseInt(id),
    },
    include: {
      students: true,
    },
  });

  if (!classData) {
    return Response.json({ error: 'Class not found' }, { status: 404 });
  }

  return Response.json({ data: classData }, { status: 200 });
};
