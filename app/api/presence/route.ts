import prisma from '@/lib/prisma';
import type { PatchBody } from '@/utils/presence';

export const PATCH = async (req: Request): Promise<Response> => {
  const body: PatchBody = await req.json().catch(() => null);

  if (!body) {
    return Response.json({ error: 'invalid body' }, { status: 400 });
  }

  const { data, timeSlotId, userId } = body;
  const date = new Date(body.date);

  if (!data || !timeSlotId || userId === undefined || !date) {
    return Response.json({ error: 'missing required fields' }, { status: 400 });
  }

  const timeSlot = await prisma.timeSlot.findUnique({
    where: { id: timeSlotId },
  });

  if (!timeSlot) {
    return Response.json({ error: 'timeslot not found' }, { status: 404 });
  }

  const user = await prisma.user.findUnique({
    where: { id: userId },
  });

  if (!user) {
    return Response.json({ error: 'user not found' }, { status: 404 });
  }

  for (const item of data) {
    const student = await prisma.student.findUnique({
      where: { id: item.studentId },
    });

    if (!student) {
      return Response.json({ error: 'student not found' }, { status: 404 });
    }

    const presence = await prisma.presence.findFirst({
      where: {
        date: {
          gte: new Date(date.getFullYear(), date.getMonth(), date.getDate()),
          lt: new Date(date.getFullYear(), date.getMonth(), date.getDate() + 1),
        },
        timeSlotId: timeSlot.id,
        studentId: item.studentId,
      },
    });

    if (presence) {
      await prisma.presence.update({
        where: { id: presence.id },
        data: { ...item, userId },
      });
    } else {
      await prisma.presence.create({
        data: { ...item, userId, timeSlotId, date, studentId: item.studentId },
      });
    }
  }

  const result = await prisma.presence.findMany({
    where: {
      date: {
        gte: new Date(date),
        lt: new Date(date.getFullYear(), date.getMonth(), date.getDate() + 1),
      },
      timeSlotId,
      userId,
    },
  });

  return Response.json(
    {
      data: result,
    },
    { status: 200 }
  );
};
