import prisma from '@/lib/prisma';
import type { TimeSlot } from '@prisma/client';

type Params = {
  params: {
    id: string;
  };
};

export const POST = async (
  req: Request,
  { params }: Params
): Promise<Response> => {
  const id = parseInt(params.id, 10);

  const data = await req.json();

  if (!data.currentTimeslot) {
    const courseData = await prisma.course.findUnique({
      where: {
        id: id,
      },
      include: {
        StudentCourse: {
          include: {
            student: {
              include: {
                presence: true,
              },
            },
          },
        },
      },
    });

    if (!courseData) {
      return Response.json({ error: 'Course not found' }, { status: 404 });
    }

    return Response.json({ data: courseData }, { status: 200 });
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

  const courseData = await prisma.course.findUnique({
    where: {
      id: id,
    },
    include: {
      StudentCourse: {
        include: {
          student: {
            include: {
              presence: {
                where: {
                  date: {
                    gte: new Date(
                      now.getFullYear(),
                      now.getMonth(),
                      now.getDate()
                    ),
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
      },
    },
  });

  if (!courseData) {
    return Response.json({ error: 'Course not found' }, { status: 404 });
  }

  return Response.json({ data: courseData }, { status: 200 });
};
