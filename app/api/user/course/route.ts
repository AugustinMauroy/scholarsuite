import prisma from '@/lib/prisma';
import type { Patch } from '@/types/patch';

export const PATCH = async (req: Request): Promise<Response> => {
  const { userId, data } = (await req.json()) as Patch;

  if (!userId || !data) return Response.json({ error: 'Invalid request' });

  for (const { opp, id } of data) {
    if (opp === 'add') {
      try {
        await prisma.userCourse.create({
          data: {
            userId,
            courseId: id,
          },
        });
      } catch (error) {
        return Response.json({ error: 'Error connecting courses' });
      }
    } else if (opp === 'remove') {
      try {
        await prisma.userCourse.deleteMany({
          where: {
            userId,
            courseId: id,
          },
        });
      } catch (error) {
        return Response.json({ error: 'Error disconnecting courses' });
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

  return Response.json({ message: 'Courses updated successfully' });
};
