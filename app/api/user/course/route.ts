import prisma from '@/lib/prisma';
import type { Patch } from '@/types/patch';

export const PATCH = async (req: Request): Promise<Response> => {
  const { id: userId, data } = (await req.json()) as Patch;

  if (!userId || !data) return Response.json({ error: 'Invalid request' });

  for (const { opp, id } of data) {
    if (opp === 'add') {
      try {
        await prisma.userGroup.create({
          data: {
            userId,
            groupId: id,
          },
        });
      } catch (error) {
        return Response.json({ error: 'Error connecting Groups' });
      }
    } else if (opp === 'remove') {
      try {
        await prisma.userGroup.deleteMany({
          where: {
            userId,
            groupId: id,
          },
        });
      } catch (error) {
        return Response.json({ error: 'Error disconnecting Groups' });
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

  return Response.json({ message: 'Groups updated' });
};
