import prisma from '@/lib/prisma';
import type { UserPatch } from '@/types/patch';

export const PATCH = async (req: Request) => {
  const { userId, data } = (await req.json()) as UserPatch;

  if (!userId || !data) return Response.json({ error: 'Invalid request' });

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
    } else if (opp === 'remove') {
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
    } else {
      return Response.json({
        error:
          'Invalid operation ' +
          opp +
          '\n' +
          "Valid operations are 'add' and 'remove'",
      });
    }
  }

  return Response.json({ message: 'Classes updated successfully' });
};
