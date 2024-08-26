import prisma from '@/lib/prisma';
import type { PatchBody } from '@/types/presence';

// API where we process presence from `/group-presence/[id]`
export const PATCH = async (req: Request): Promise<Response> => {
  const body: PatchBody = await req.json().catch(() => null);

  if (!body) {
    return Response.json({ error: 'invalid body' }, { status: 400 });
  }

  const { data, timeSlotId, userId, groupId } = body;
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

  const currentAcademicYear = await prisma.academicYear.findFirst({
    where: {
      startDate: {
        lte: new Date(),
      },
      endDate: {
        gte: new Date(),
      },
    },
  });

  if (!currentAcademicYear) {
    return Response.json({ error: 'no academic year found' }, { status: 404 });
  }

  if (
    date < currentAcademicYear.startDate ||
    date > currentAcademicYear.endDate
  ) {
    return Response.json(
      { error: 'date not within current academic year' },
      { status: 400 }
    );
  }

  const user = await prisma.user.findUnique({
    where: { id: userId },
  });

  if (!user) {
    return Response.json({ error: 'user not found' }, { status: 404 });
  }

  const now = new Date();
  const academicYear = await prisma.academicYear.findFirst({
    where: {
      startDate: { lte: now },
      endDate: { gte: now },
    },
  });

  if (!academicYear) {
    return Response.json({ error: 'no academic year found' }, { status: 404 });
  }

  if (date < academicYear.startDate || date > academicYear.endDate) {
    return Response.json(
      { error: 'date not within current academic year' },
      { status: 400 }
    );
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
      await prisma.presenceAudit.create({
        data: {
          presenceId: presence.id,
          state: presence.state,
          date: presence.date,
          userId: presence.userId,
          academicYearId: presence.academicYearId,
          timeSlotId: presence.timeSlotId,
          groupId: presence.groupId,
          processed: presence.processed,
          notified: presence.notified,
          changedBy: userId,
        },
      });

      // Check if the state is ABSENT
      if (item.state === 'ABSENT') {
        const absencePeriod = await prisma.absencePeriod.findFirst({
          where: {
            studentId: item.studentId,
            lastAbsenceId: presence.id,
          },
        });

        if (absencePeriod) {
          // Update the last absence record
          await prisma.absencePeriod.update({
            where: { id: absencePeriod.id },
            data: { lastAbsenceId: presence.id },
          });
        } else {
          // Create a new absence period
          await prisma.absencePeriod.create({
            data: {
              studentId: item.studentId,
              firstAbsenceID: presence.id,
              lastAbsenceId: presence.id,
              academicYearId: academicYear.id,
              status: 'PENDING',
            },
          });
        }
      } else if (
        item.state === 'PRESENT' ||
        item.state === 'LATE' ||
        item.state === 'EXCUSED'
      ) {
        const absencePeriod = await prisma.absencePeriod.findFirst({
          where: {
            studentId: item.studentId,
            nextPresenceId: presence.id,
          },
        });

        if (absencePeriod) {
          // Update the next presence record
          await prisma.absencePeriod.update({
            where: { id: absencePeriod.id },
            data: { nextPresenceId: presence.id },
          });
        }
      }
    } else {
      await prisma.presence.create({
        data: {
          ...item,
          userId,
          timeSlotId,
          groupId,
          date,
          studentId: item.studentId,
          academicYearId: academicYear.id,
        },
      });
    }
  }

  // Don't send result back to client
  // But send fresh data to client
  // it's same as GET /api/group/[id]
  const groupData = await prisma.group.findUnique({
    where: {
      id: groupId,
    },
    include: {
      StudentGroup: {
        include: {
          Student: {
            include: {
              Class: true,
              Presence: {
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
                  timeSlotId,
                },
              },
            },
          },
        },
      },
    },
  });

  return Response.json(
    {
      data: groupData,
    },
    { status: 200 }
  );
};
