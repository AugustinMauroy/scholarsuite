import { getServerSession } from 'next-auth';
import prisma from '@/lib/prisma';
import nextAuthConfig from '@/lib/auth';

export const GET = async (req: Request): Promise<Response> => {
  const session = await getServerSession(nextAuthConfig);
  const schoolLevel = await prisma.schoolLevel.findMany({
    where: {
    },
    include: {
      classes: true,
    },
  });

  return Response.json({ data: schoolLevel }, { status: 200 });
};
