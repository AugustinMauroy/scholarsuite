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
