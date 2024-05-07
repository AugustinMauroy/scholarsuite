import prisma from '@/lib/prisma';
import type { Patch } from '@/components/User/ClassList';

export const PATCH = async (req: Request) => {
  const { userId, data } = (await req.json()) as Patch;

  for (const { opp, classId } of data) {
    if (opp === 'add') {
      await prisma.user
        .update({
          where: {
            id: userId,
          },
          data: {
            Class: {
              connect: {
                id: classId,
              },
            },
          },
        })
        .catch(() => {
          return Response.json({ error: 'Error connecting classes' });
        });
    } else {
      await prisma.user
        .update({
          where: {
            id: userId,
          },
          data: {
            Class: {
              disconnect: {
                id: classId,
              },
            },
          },
        })
        .catch(() => {
          return Response.json({ error: 'Error disconnecting classes' });
        });
    }
  }

  return Response.json({ message: 'Classes updated successfully' });
};
