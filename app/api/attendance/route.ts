import prisma from '@/lib/prisma';
import type { PatchBody } from '@/types/Attendance';

// API where we process attendance from `/group-attendance/[id]`
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

  const now = new Date();
  const academicYear = await prisma.academicYear.findFirst({
    where: {
      startDate: {
        lte: now,
      },
      endDate: {
        gte: now,
      },
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
      return Response.json(
        { error: `student not found id: ${item.studentId}` },
        { status: 404 }
      );
    }

    const currentAttendance = await prisma.attendance.findFirst({
      where: {
        date: {
          gte: new Date(date.getFullYear(), date.getMonth(), date.getDate()),
          lt: new Date(date.getFullYear(), date.getMonth(), date.getDate() + 1),
        },
        timeSlotId: timeSlot.id,
        studentId: item.studentId,
      },
    });

    if (currentAttendance) {
      await prisma.attendance.update({
        where: { id: currentAttendance.id },
        data: { ...item, userId },
      });
      await prisma.attendanceAudit.create({
        data: {
          attendanceId: currentAttendance.id,
          state: currentAttendance.state,
          date: currentAttendance.date,
          userId: currentAttendance.userId,
          academicYearId: currentAttendance.academicYearId,
          timeSlotId: currentAttendance.timeSlotId,
          groupId: currentAttendance.groupId,
          processed: currentAttendance.processed,
          notified: currentAttendance.notified,
          changedBy: userId,
        },
      });

      /**
       * Pour trouver la précédente présence, c'est rechercher la présence pour l'étudiant
       * de la même année académique dont la date est strictement inférieure à la date de la présence
       * (comparaison y compris date et heure)
       */

      /**
       * Pour trouver la prochaine présence, c'est rechercher la présence pour l'étudiant
       * de la même année académique dont la date minimum qui est strictement supérieure à la date de la présence
       */

      if (item.state === 'ABSENT') {
        /**
         * - if no past Absenceperiode needed to create => P +A || P -P +A P || +A P
         *   previous = null && next = null
         *   previous = P && next = null
         *   previous = null && next = P
         *   Action:
         *    - Check if period already exists => startAbsencePeriod > presence.date && presence.date < startAbsencePeriod
         *    - if exists update it and log the change
         *    - if not create it
         * - if to extend by begin => P +A A
         *   previous = P && next = A && current != A
         *   Action:
         *    - Check if period already exists => preiodeAbsence.firstAttendance.date == nextAbsencePeriod.nextAttendance.date
         *    - if not found create it and log error
         *    - if found update
         * - if to extend by the end => P A + A
         *   previous = A && next = A && current != A
         *   Action:
         *    - Check if period already exists => preiodeAbsence.lastAttendance.date == nextAbsencePeriod.firstAttendance.date
         *    - if not found create it and log error
         *    - if found update
         * - If need to merge with the next Absenceperiode => A -P +A A
         *   previous = A && next = A && current = A
         *   Action:
         *    - check if previous period exists => preiodeAbsence.lastAttendance.date == nextAbsencePeriod.firstAttendance.date
         *    - check if next period exists => preiodeAbsence.firstAttendance.date == nextAbsencePeriod.lastAttendance.date
         *    - if not found create it and log error
         *    - if found update and soft delete the next period
         *
         * Dans les actions, on ne peut PAS étendre par le début, étendre par la fin ou merger des périodes d’absence déjà justifiées (positivement ou injustifié).
         * Dans ce cas, il faut juste créer une nouvelle période d’absence.
         */
      } else if (item.state === 'PRESENT' || item.state === 'LATE') {
        /**
         * - if Absenceperiode need to be ended => P AAA + P
         *   previous = A && next != A && current != A
         *   Actions:
         *    - Check if period already exists => preiodeAbsence.lastAttendance.date == presence.date
         *    - if exists update
         *    - if not create it and log error
         * - if Absenceperiode need to be split => P AAA +P AAA P
         *   previous = A && next = A && current = A
         * - if Absenceperiode need to be shortened by the beginning => P -A +P AAA P
         *   previous = (P || L) && next = A && current = A
         * - if Absenceperiode need to be shortened by the end => P AAA +P -A P
         *   previous = A && next = (P || L) && current = A
         * - if Absenceperiode need to be deleted (soft delete enabled) => P -A +P P
         *   previous != A  && next != A && current = A
         */
      }
    } else {
      await prisma.attendance.create({
        data: {
          ...item,
          userId,
          timeSlotId,
          groupId,
          // @TODO: Use timeslot to have hour and minute
          // put hour and minute to 0
          date: new Date(date.getFullYear(), date.getMonth(), date.getDate()),
          studentId: item.studentId,
          academicYearId: academicYear.id,
        },
      });
    }
  }

  // @TODO: refracto to unsure there are no duplicate code
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
              Attendance: {
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
