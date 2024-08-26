import prisma from '@/lib/prisma';
import type { TimeSlot } from '@prisma/client';

type Params = {
  params: {
    id: string;
  };
};

export const GET = async (
  req: Request,
  { params }: Params
): Promise<Response> => {
  const { id } = params;

  const classData = await prisma.class.findUnique({
    where: {
      id: parseInt(id),
    },
    include: {
      Students: {
        where: {
          enabled: true,
        },
        include: {
          Presence: true,
        },
      },
    },
  });

  if (!classData) {
    return Response.json({ error: 'Class not found' }, { status: 404 });
  }

  return Response.json({ data: classData }, { status: 200 });
};

export const POST = async (
  req: Request,
  { params }: Params
): Promise<Response> => {
  const id = parseInt(params.id, 10);

  const data = await req.json();

  if (!data.currentTimeslot) {
    const classData = await prisma.class.findUnique({
      where: {
        id: id,
      },
      include: {
        Students: {
          where: {
            enabled: true,
          },
          include: {
            Presence: true,
          },
        },
      },
    });

    if (!classData) {
      return Response.json({ error: 'Class not found' }, { status: 404 });
    }

    return Response.json({ data: classData }, { status: 200 });
  }

  const timeSlots = await prisma.timeSlot.findMany();
  const now = data.date ? new Date(data.date) : new Date();
  const currentTimeslot =
    data.currentTimeslot ||
    timeSlots.find((slot: TimeSlot) => {
      const start = slot.startTime;
      const end = slot.endTime;
      const [startHour, startMinute] = start.split(':').map(Number);
      const [endHour, endMinute] = end.split(':').map(Number);
      const startSlot = new Date();
      startSlot.setHours(startHour, startMinute);
      const endSlot = new Date();
      endSlot.setHours(endHour, endMinute);

      return now >= startSlot && now <= endSlot;
    });

  const classData = await prisma.class.findUnique({
    where: {
      id: id,
    },
    include: {
      Students: {
        where: {
          enabled: true,
        },
        include: {
          Presence: {
            where: {
              date: {
                gte: new Date(now.getFullYear(), now.getMonth(), now.getDate()),
                lt: new Date(
                  now.getFullYear(),
                  now.getMonth(),
                  now.getDate() + 1
                ),
              },
              timeSlotId: currentTimeslot.id,
            },
          },
        },
      },
    },
  });

  if (!classData) {
    return Response.json({ error: 'Class not found' }, { status: 404 });
  }

  return Response.json({ data: classData }, { status: 200 });
};

export const PATCH = async (
  req: Request,
  { params }: Params
): Promise<Response> => {
  const { id } = params;
  const { name } = await req.json();

  const updatedClass = await prisma.class.update({
    where: { id: parseInt(id, 10) },
    data: { name },
  });

  return Response.json({ class: updatedClass }, { status: 200 });
};
