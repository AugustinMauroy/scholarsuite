import prisma from '@/lib/prisma';
import type { Patch } from '@/types/patch';

export const PATCH = async (req: Request) => {
  const { userId, data } = (await req.json()) as Patch;

  for (const { opp, id } of data) {
    if (opp === 'add') {
      try {
        await prisma.userClass.create({
          data: {
            userId,
            classId: id,
          },
        });
      } catch (error) {
        return Response.json({ error: 'Error connecting classes' });
      }
    } else {
      try {
        await prisma.userClass.deleteMany({
          where: {
            userId,
            classId: id,
          },
        });
      } catch (error) {
        return Response.json({ error: 'Error disconnecting classes' });
      }
    }
  }

  return Response.json({ message: 'Classes updated successfully' });
};
