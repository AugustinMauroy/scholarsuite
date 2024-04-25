import prisma from '@/lib/prisma';

export const GET = async (req: Request) => {
  const schoolLevels = await prisma.schoolLevel.findMany();

  return Response.json({
    data: schoolLevels,
  });
};
