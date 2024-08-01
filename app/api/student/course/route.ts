import prisma from '@/lib/prisma';
import type { Patch } from '@/types/patch';

export const PATCH = async (req: Request): Promise<Response> => {
  const { id: studentId, data } = (await req.json()) as Patch;

  if (!studentId || !data) return Response.json({ error: 'Invalid request' });

  for (const { opp, id } of data) {
    if (opp === 'add') {
      try {
        await prisma.studentGroup.create({
          data: {
            studentId,
            groupId: id,
          },
        });
      } catch (error) {
        return Response.json({ error: 'Error connecting groups' });
      }
    } else if (opp === 'remove') {
      try {
        await prisma.studentGroup.deleteMany({
          where: {
            studentId,
            groupId: id,
          },
        });
      } catch (error) {
        return Response.json({ error: 'Error disconnecting groups' });
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

  return Response.json({ message: 'Groups updated successfully' });
};
