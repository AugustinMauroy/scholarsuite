import prisma from '@/lib/prisma';
import type { Patch } from '@/components/User/ClassList';

export const PATCH = async (req: Request) => {
  const { userId, data } = (await req.json()) as Patch;

  for (const { opp, classId } of data) {
    if (opp === 'add') {
      try {
        await prisma.userClass.create({
          data: {
            userId,
            classId,
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
            classId,
          },
        });
      } catch (error) {
        return Response.json({ error: 'Error disconnecting classes' });
      }
    }
  }

  return Response.json({ message: 'Classes updated successfully' });
};
