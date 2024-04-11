import prisma from '@/lib/prisma';

export const GET = async (req: Request): Promise<Response> => {
  const classes = await prisma.class.findMany({
    include: {
      schoolLevel: true,
    },
  });

  return Response.json({ data: classes }, { status: 200 });
};
