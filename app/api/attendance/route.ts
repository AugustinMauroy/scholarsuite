import prisma from '@/lib/prisma';
import { getValue } from '@/utils/timeslot';
import type { PatchBody } from '@/types/attendance';

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

  const currentTimeSlot = await prisma.timeSlot.findUnique({
    where: { id: timeSlotId },
  });

  if (!currentTimeSlot) {
    return Response.json({ error: 'timeslot not found' }, { status: 404 });
  }
  const timeSlotHour = getValue(currentTimeSlot.startTime).hour;
  const timeSlotMinute = getValue(currentTimeSlot.startTime).minute;

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

    let currentAttendance = await prisma.attendance.findFirst({
      where: {
        date: {
          gte: new Date(date.getFullYear(), date.getMonth(), date.getDate()),
          lt: new Date(date.getFullYear(), date.getMonth(), date.getDate() + 1),
        },
        timeSlotId: currentTimeSlot.id,
        studentId: item.studentId,
      },
    });

    // attendance proccess + audit
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
    } else {
      await prisma.attendance.create({
        data: {
          ...item,
          userId,
          timeSlotId,
          groupId,
          date: new Date(
            date.getFullYear(),
            date.getMonth(),
            date.getDate(),
            timeSlotHour,
            timeSlotMinute
          ),
          studentId: item.studentId,
          academicYearId: academicYear.id,
        },
      });
    }

    // Proccess absence period
    currentAttendance = await prisma.attendance.findFirst({
      where: {
        date: {
          gte: new Date(date.getFullYear(), date.getMonth(), date.getDate()),
          lt: new Date(date.getFullYear(), date.getMonth(), date.getDate() + 1),
        },
        timeSlotId: currentTimeSlot.id,
        studentId: item.studentId,
      },
    });

    if (!currentAttendance) {
      return Response.json(
        { error: `attendance not found id: ${item.studentId}` },
        { status: 404 }
      );
    }

    /**
     * Pour trouver la précédente présence, c'est rechercher la présence pour l'étudiant
     * de la même année académique dont la date est strictement inférieure à la date de la présence
     * (comparaison y compris date et heure)
     */
    const previousAttendance = await prisma.attendance.findFirst({
      where: {
        date: {
          // less than
          lt: new Date(
            date.getFullYear(),
            date.getMonth(),
            date.getDate(),
            timeSlotHour,
            timeSlotMinute
          ),
        },
        studentId: item.studentId,
        academicYearId: academicYear.id,
      },
      orderBy: {
        date: 'desc',
      },
    });

    /**
     * Pour trouver la prochaine présence, c'est rechercher la présence pour l'étudiant
     * de la même année académique dont la date minimum qui est strictement supérieure à la date de la présence
     */
    const nextAttendance = await prisma.attendance.findFirst({
      where: {
        date: {
          // greater than
          gt: new Date(
            date.getFullYear(),
            date.getMonth(),
            date.getDate(),
            timeSlotHour,
            timeSlotMinute
          ),
        },
        studentId: item.studentId,
        academicYearId: academicYear.id,
      },
      orderBy: {
        date: 'asc',
      },
    });

    /**
     * Pour trouver la période d'absence actuelle, c'est rechercher la période d'absence pour l'étudiant
     * de la même année académique dont la première présence est inférieure ou égale à la date de la présence
     * et la dernière présence est supérieure ou égale à la date de la présence
     */
    const currentPeriod = await prisma.absencePeriod.findFirst({
      where: {
        Student: {
          id: item.studentId,
        },
        AcademicYear: {
          id: academicYear.id,
        },
        FirstAbsence: {
          date: {
            // less than or equal to
            lte: new Date(
              date.getFullYear(),
              date.getMonth(),
              date.getDate(),
              timeSlotHour,
              timeSlotMinute
            ),
          },
        },
        LastAbsence: {
          date: {
            // greater than or equal to
            gte: new Date(
              date.getFullYear(),
              date.getMonth(),
              date.getDate(),
              timeSlotHour,
              timeSlotMinute
            ),
          },
        },
      },
    });

    // @DEBUG
    console.log('DEBUG: ');
    console.log('item: ', item);
    console.log('currentAttendance: ', currentAttendance);
    console.log('previousAttendance: ', previousAttendance);
    console.log('nextAttendance: ', nextAttendance);
    console.log('currentPeriod: ', currentPeriod);

    if (item.state === 'ABSENT') {
      /**
       * - if no past Absenceperiode needed to create => P +A || P -P +A P || +A P
       *   (previous = null && next = null) ||
       *   (previous = P && next = null) ||
       *   (previous = null && next = P)
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
      if (
        (!previousAttendance && !nextAttendance) ||
        (previousAttendance?.state !== 'ABSENT' && !nextAttendance) ||
        (!previousAttendance && nextAttendance?.state !== 'ABSENT')
      ) {
        // Create new absence period
        console.log('create new absence period');

        if (currentPeriod) {
          await prisma.absencePeriod.update({
            where: { id: currentPeriod.id },
            data: {
              LastAbsence: {
                connect: {
                  id: currentAttendance.id,
                },
              },
            },
          });
          console.error(
            'Absence period already exists\nWhen trying to create new absence period'
          );
        } else {
          await prisma.absencePeriod.create({
            data: {
              FirstAbsence: {
                connect: {
                  id: currentAttendance.id,
                },
              },
              LastAbsence: {
                connect: {
                  id: currentAttendance.id,
                },
              },
              Student: {
                connect: {
                  id: item.studentId,
                },
              },
              AcademicYear: {
                connect: {
                  id: academicYear.id,
                },
              },
            },
          });
        }
      } else if (
        previousAttendance?.state === 'PRESENT' &&
        nextAttendance?.state === 'ABSENT'
      ) {
        // extend by the beginning
        console.log('extend by the beginning');

        if (currentPeriod) {
          await prisma.absencePeriod.update({
            where: { id: currentPeriod.id },
            data: {
              FirstAbsence: {
                connect: {
                  id: currentAttendance.id,
                },
              },
            },
          });
        } else {
          await prisma.absencePeriod.create({
            data: {
              FirstAbsence: {
                connect: {
                  id: currentAttendance.id,
                },
              },
              LastAbsence: {
                connect: {
                  id: currentAttendance.id,
                },
              },
              Student: {
                connect: {
                  id: item.studentId,
                },
              },
              AcademicYear: {
                connect: {
                  id: academicYear.id,
                },
              },
            },
          });
          console.error(
            'Absence period not found\nWhen trying to extend by the beginning'
          );
        }
      } else if (
        previousAttendance?.state === 'ABSENT' &&
        !nextAttendance?.state
      ) {
        // extend by the end
        console.log('extend by the end');

        if (currentPeriod) {
          await prisma.absencePeriod.update({
            where: { id: currentPeriod.id },
            data: {
              LastAbsence: {
                connect: {
                  id: currentAttendance.id,
                },
              },
            },
          });
        } else {
          await prisma.absencePeriod.create({
            data: {
              FirstAbsence: {
                connect: {
                  id: currentAttendance.id,
                },
              },
              LastAbsence: {
                connect: {
                  id: currentAttendance.id,
                },
              },
              Student: {
                connect: {
                  id: item.studentId,
                },
              },
              AcademicYear: {
                connect: {
                  id: academicYear.id,
                },
              },
            },
          });
          console.error(
            'Absence period not found\nWhen trying to extend by the end'
          );
        }
      } else if (
        previousAttendance?.state === 'ABSENT' &&
        nextAttendance?.state === 'ABSENT'
      ) {
        // merge with the next Absenceperiode
        console.log('merge with the next Absenceperiode');

        if (currentPeriod) {
          await prisma.absencePeriod.update({
            where: { id: currentPeriod.id },
            data: {
              LastAbsence: {
                connect: {
                  id: nextAttendance.id,
                },
              },
            },
          });
          await prisma.absencePeriod.update({
            where: { id: currentPeriod.id },
            data: {
              FirstAbsence: {
                connect: {
                  id: previousAttendance.id,
                },
              },
            },
          });
          await prisma.absencePeriod.update({
            where: { id: nextAttendance.id },
            data: {
              enabled: false,
            },
          });
        } else {
          await prisma.absencePeriod.create({
            data: {
              FirstAbsence: {
                connect: {
                  id: previousAttendance.id,
                },
              },
              LastAbsence: {
                connect: {
                  id: nextAttendance.id,
                },
              },
              Student: {
                connect: {
                  id: item.studentId,
                },
              },
              AcademicYear: {
                connect: {
                  id: academicYear.id,
                },
              },
            },
          });
          console.error(
            'Absence period not found\nWhen trying to merge with the next Absenceperiode'
          );
        }
      } else {
        console.warn('Any case matched');
      }
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
      if (
        previousAttendance?.state === 'ABSENT' &&
        nextAttendance?.state !== 'ABSENT'
      ) {
        // end absence period
        console.log('end absence period');

        if (currentPeriod) {
          await prisma.absencePeriod.update({
            where: { id: currentPeriod.id },
            data: {
              LastAbsence: {
                connect: {
                  id: currentAttendance.id,
                },
              },
            },
          });
        } else {
          await prisma.absencePeriod.create({
            data: {
              FirstAbsence: {
                connect: {
                  id: currentAttendance.id,
                },
              },
              LastAbsence: {
                connect: {
                  id: currentAttendance.id,
                },
              },
              Student: {
                connect: {
                  id: item.studentId,
                },
              },
              AcademicYear: {
                connect: {
                  id: academicYear.id,
                },
              },
            },
          });
          console.error(
            'Absence period not found\nWhen trying to end absence period'
          );
        }
      } else if (
        previousAttendance?.state === 'ABSENT' &&
        nextAttendance?.state === 'ABSENT'
      ) {
        // split absence period

        if (currentPeriod) {
          await prisma.absencePeriod.update({
            where: { id: currentPeriod.id },
            data: {
              LastAbsence: {
                connect: {
                  id: currentAttendance.id,
                },
              },
            },
          });
        } else {
          await prisma.absencePeriod.create({
            data: {
              FirstAbsence: {
                connect: {
                  id: currentAttendance.id,
                },
              },
              LastAbsence: {
                connect: {
                  id: currentAttendance.id,
                },
              },
              Student: {
                connect: {
                  id: item.studentId,
                },
              },
              AcademicYear: {
                connect: {
                  id: academicYear.id,
                },
              },
            },
          });
          console.error(
            'Absence period not found\nWhen trying to split absence period'
          );
        }
      } else if (
        (previousAttendance?.state === 'PRESENT' ||
          previousAttendance?.state === 'LATE') &&
        nextAttendance?.state === 'ABSENT'
      ) {
        // shorten absence period by the beginning

        if (currentPeriod) {
          await prisma.absencePeriod.update({
            where: { id: currentPeriod.id },
            data: {
              FirstAbsence: {
                connect: {
                  id: currentAttendance.id,
                },
              },
            },
          });
        } else {
          await prisma.absencePeriod.create({
            data: {
              FirstAbsence: {
                connect: {
                  id: currentAttendance.id,
                },
              },
              LastAbsence: {
                connect: {
                  id: currentAttendance.id,
                },
              },
              Student: {
                connect: {
                  id: item.studentId,
                },
              },
              AcademicYear: {
                connect: {
                  id: academicYear.id,
                },
              },
            },
          });
          console.error(
            'Absence period not found\nWhen trying to shorten absence period by the beginning'
          );
        }
      } else if (
        previousAttendance?.state === 'ABSENT' &&
        (nextAttendance?.state === 'PRESENT' ||
          nextAttendance?.state === 'LATE')
      ) {
        // shorten absence period by the end
        console.log('shorten absence period by the end');

        if (currentPeriod) {
          await prisma.absencePeriod.update({
            where: { id: currentPeriod.id },
            data: {
              LastAbsence: {
                connect: {
                  id: currentAttendance.id,
                },
              },
            },
          });
        } else {
          await prisma.absencePeriod.create({
            data: {
              FirstAbsence: {
                connect: {
                  id: currentAttendance.id,
                },
              },
              LastAbsence: {
                connect: {
                  id: currentAttendance.id,
                },
              },
              Student: {
                connect: {
                  id: item.studentId,
                },
              },
              AcademicYear: {
                connect: {
                  id: academicYear.id,
                },
              },
            },
          });
          console.error(
            'Absence period not found\nWhen trying to shorten absence period by the end'
          );
        }
      } else if (
        previousAttendance?.state !== 'ABSENT' &&
        nextAttendance?.state !== 'ABSENT'
      ) {
        // delete absence period
        console.log('delete absence period');

        if (currentPeriod) {
          await prisma.absencePeriod.update({
            where: { id: currentPeriod.id },
            data: {
              enabled: false,
            },
          });
        } else {
          console.error(
            'Absence period not found\nWhen trying to delete absence period'
          );
        }
      } else {
        console.warn('Any case matched');
      }
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
