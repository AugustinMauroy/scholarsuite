import prisma from '@/lib/prisma';
import { getValue } from '@/utils/timeslot';
import { getGroupWithStudentsAndAttendance } from '@/lib/queries/group';
import { createAbsencePeriod } from '@/lib/queries/absencePeriod';
import { getCurrentAttendance } from '@/lib/queries/attendance';
import type { PatchBody } from '@/types/attendance';

// API where we process attendance from `/group-attendance/[id]`
export const PATCH = async (req: Request): Promise<Response> => {
  const body: PatchBody = await req.json().catch(() => null);

  if (!body) return Response.json({ error: 'invalid body' }, { status: 400 });

  const { data, groupId } = body;
  const timeSlotId = Number(body.timeSlotId);
  const userId = Number(body.userId);
  const date = new Date(body.date);

  if (Number.isNaN(timeSlotId) || Number.isNaN(userId) || !date)
    return Response.json({ error: 'invalid body' }, { status: 400 });

  if (!data || timeSlotId === undefined || userId === undefined || !date)
    return Response.json({ error: 'missing required fields' }, { status: 400 });

  const currentTimeSlot = await prisma.timeSlot.findUnique({
    where: { id: timeSlotId },
  });

  if (!currentTimeSlot)
    return Response.json({ error: 'timeslot not found' }, { status: 404 });

  const { hour: timeSlotHour, minute: timeSlotMinute } = getValue(
    currentTimeSlot.startTime
  );

  const academicYear = await prisma.academicYear.findFirst({
    where: {
      current: true,
    },
  });

  if (!academicYear)
    return Response.json({ error: 'no academic year found' }, { status: 404 });

  if (date < academicYear.startDate || date > academicYear.endDate)
    return Response.json(
      { error: 'date not within current academic year' },
      { status: 400 }
    );

  const user = await prisma.user.findUnique({
    where: { id: userId },
  });

  if (!user) return Response.json({ error: 'user not found' }, { status: 404 });

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

    /**
     * Valeur de l'attendace avant tous proccess
     */
    const existingAttendance = await getCurrentAttendance({
      item,
      currentTimeSlot,
      date,
    });

    const attendanceDate = new Date(
      date.getFullYear(),
      date.getMonth(),
      date.getDate(),
      timeSlotHour,
      timeSlotMinute
    );

    // attendance proccess + audit
    if (existingAttendance) {
      await prisma.attendance.update({
        where: { id: existingAttendance.id },
        data: { ...item, userId: userId },
      });
      await prisma.attendanceAudit.create({
        data: {
          attendanceId: existingAttendance.id,
          state: existingAttendance.state,
          date: existingAttendance.date,
          userId: existingAttendance.userId,
          academicYearId: existingAttendance.academicYearId,
          timeSlotId: existingAttendance.timeSlotId,
          groupId: existingAttendance.groupId,
          changedBy: userId,
        },
      });
    } else {
      await prisma.attendance.create({
        data: {
          ...item,
          userId: userId,
          timeSlotId,
          groupId,
          date: attendanceDate,
          studentId: item.studentId,
          academicYearId: academicYear.id,
        },
      });
    }

    // Proccess absence period
    const currentAttendance = await getCurrentAttendance({
      item,
      currentTimeSlot,
      date,
    });

    if (!currentAttendance) {
      return Response.json(
        { error: `attendance not found id: ${item.studentId}` },
        { status: 404 }
      );
    }

    /**
     * Pour trouver la période d'absence actuelle, c'est rechercher la période d'absence pour l'étudiant
     * de la même année académique dont la première Attendance est inférieure ou égale à la date de la Attendance
     * et la dernière Attendance est supérieure ou égale à la date de la Attendance
     */
    const previousAttendance = await prisma.attendance.findFirst({
      where: {
        date: {
          // less than
          lt: attendanceDate,
        },
        studentId: item.studentId,
        academicYearId: academicYear.id,
      },
      orderBy: {
        date: 'desc',
      },
    });
    /**
     * Pour trouver la prochaine Attendance, c'est rechercher la Attendance pour l'étudiant
     * de la même année académique dont la date minimum qui est strictement supérieure à la date de la Attendance
     */
    const nextAttendance = await prisma.attendance.findFirst({
      where: {
        date: {
          // greater than
          gt: attendanceDate,
        },
        studentId: item.studentId,
        academicYearId: academicYear.id,
      },
      orderBy: {
        date: 'asc',
      },
    });
    /**
     * La période d'absence précédente est étendable si l'Attendance précédente est une Absence
     */
    const previousAbsPeriod =
      previousAttendance?.state === 'ABSENT'
        ? await prisma.absencePeriod.findFirst({
            where: {
              enabled: true,
              Student: {
                id: item.studentId,
              },
              AcademicYear: {
                id: academicYear.id,
              },
              LastAbsence: {
                id: previousAttendance.id,
              },
            },
            include: {
              FirstAbsence: true,
              LastAbsence: true,
            },
          })
        : null;
    /**
     * Pour trouver la précédente période d'absence, c'est rechercher la présence pour l'étudiant
     * de la même année académique dont la date est strictement inférieure à la date de la présence
     * (comparaison y compris date et heure)
     */
    const currentAbsPeriod = await prisma.absencePeriod.findFirst({
      where: {
        enabled: true,
        Student: {
          id: item.studentId,
        },
        AcademicYear: {
          id: academicYear.id,
        },
        AND: [
          {
            FirstAbsence: {
              date: {
                // less than or equal to
                lte: attendanceDate,
              },
            },
          },
          {
            LastAbsence: {
              date: {
                // greater than or equal to
                gte: attendanceDate,
              },
            },
          },
        ],
      },
      include: {
        FirstAbsence: true,
        LastAbsence: true,
      },
    });
    const nextAbsencePeriod =
      nextAttendance?.state === 'ABSENT'
        ? await prisma.absencePeriod.findFirst({
            where: {
              enabled: true,
              Student: {
                id: item.studentId,
              },
              AcademicYear: {
                id: academicYear.id,
              },
              FirstAbsence: {
                id: nextAttendance.id,
              },
            },
            include: {
              FirstAbsence: true,
              LastAbsence: true,
            },
          })
        : null;

    // @DEBUG
    console.log('DEBUG: ');
    console.log('item: ', item);
    console.log('currentAttendance: ', currentAttendance);
    console.log('previousAttendance: ', previousAttendance);
    console.log('nextAttendance: ', nextAttendance);
    console.log('previousAbsPeriod: ', previousAbsPeriod);
    console.log('currentAbsPeriod: ', currentAbsPeriod);
    console.log('nextAbsencePeriod: ', nextAbsencePeriod);
    console.log('existingAttendance: ', existingAttendance);

    if (item.state === 'ABSENT') {
      /**
       * Quand on met une absence :
       * - Case 1: if no previous Absenceperiod : create it => +A || P +A || P -P +A P || +A P
       *   (previous != A && next != A)
       *   Action:
       *    - Check if period already exists : update it and log the error
       *    - if not create it
       *
       * - case 2: extend by begin => P +A A
       *   previous != A && next = A
       *   Action:
       *    - Check if nextPeriod already exists
       *    - if not found create it and log error
       *    - if found update it
       *
       * - case 3: if to extend by the end => A + A +P
       *   previous = A && next != A
       *   Action:
       *    - Check if previousPeriod already exists
       *    - if not found create it and log error
       *    - if found update
       *
       * - case 4: If need to merge with the previous Absenceperiode, delete next absPeroid => A -P +A A
       *   previous = A && next = A && existingAttendance = L||P
       *   Action:
       *    - if previous doesn't exist create it and log error
       *    - else update previous
       *    - if next doesn't exist and log the error
       *    - else soft delete the next period
       *
       * A REDISCUTER
       * Dans les actions, on ne peut PAS étendre par le début, étendre par la fin ou merger des périodes d’absence déjà justifiées (positivement ou injustifié).
       * Dans ce cas, il faut juste créer une nouvelle période d’absence.
       */
      if (
        previousAttendance?.state !== 'ABSENT' &&
        nextAttendance?.state !== 'ABSENT'
      ) {
        // Case 1: create new absence period
        console.log('Case 1: create new absence period');
        if (currentAbsPeriod) {
          await prisma.absencePeriod.update({
            where: { id: currentAbsPeriod.id },
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
            },
          });
          console.error(
            'Absence period already exists\nWhen trying to create new absence period'
          );
        } else {
          console.log('create new absence period');
          await createAbsencePeriod({
            currentAttendance,
            item,
            academicYear,
          });
        }
      } else if (
        previousAttendance?.state !== 'ABSENT' &&
        nextAttendance?.state === 'ABSENT'
      ) {
        console.log('Case 2: extend by the beginning');
        if (nextAbsencePeriod) {
          await prisma.absencePeriod.update({
            where: { id: nextAbsencePeriod.id },
            data: {
              FirstAbsence: {
                connect: {
                  id: currentAttendance.id,
                },
              },
            },
          });
        } else {
          await createAbsencePeriod({
            currentAttendance,
            item,
            academicYear,
          });
          console.error(
            'Absence period not found\nWhen trying to extend by the beginning'
          );
        }
      } else if (
        previousAttendance?.state === 'ABSENT' &&
        nextAttendance?.state !== 'ABSENT'
      ) {
        // Case 3: extend by the end
        console.log('Case 3: extend by the end');
        if (previousAbsPeriod) {
          await prisma.absencePeriod.update({
            where: { id: previousAbsPeriod.id },
            data: {
              LastAbsence: {
                connect: {
                  id: currentAttendance.id,
                },
              },
            },
          });
        } else {
          await createAbsencePeriod({
            currentAttendance,
            item,
            academicYear,
          });
          console.error(
            'Absence period not found\nWhen trying to extend by the end'
          );
        }
      } else if (
        previousAttendance?.state === 'ABSENT' &&
        nextAttendance?.state === 'ABSENT' &&
        existingAttendance !== null &&
        existingAttendance.state !== 'ABSENT'
      ) {
        console.log(
          'Case 4: If need to merge with the previous Absenceperiode, delete next absPeroid'
        );
        if (!previousAbsPeriod) {
          await createAbsencePeriod({
            currentAttendance,
            item,
            academicYear,
          });
          console.error(
            'Absence period not found\nWhen trying to merge with the previous Absenceperiode'
          );
        } else {
          await prisma.absencePeriod.update({
            where: { id: previousAbsPeriod.id },
            data: {
              LastAbsence: {
                connect: {
                  id: currentAttendance.id,
                },
              },
            },
          });
        }

        if (nextAbsencePeriod) {
          await prisma.absencePeriod.update({
            where: { id: nextAbsencePeriod.id },
            data: {
              enabled: false,
            },
          });
        } else {
          console.error(
            'Absence period not found\nWhen trying to merge with the previous Absenceperiode'
          );
        }
      } else {
        console.warn('Any case matched');
      }
    } else {
      /**
       * Quand on met attendance autre que absence (présence ou retard):
       * - case 5 if AbsencePeriod need to be split => P AAA +P AAA P
       *   previous = A && next = A
       *
       * - case 6: if AbsencePeriod need to be shortened by the beginning => (P) -A +P AAA P
       *   previous != A && next = A
       *
       * - case 7 if AbsencePeriod need to be shortened by the end => P AAA +P -A (P)
       *   previous = A && next != A
       *
       * - case 8: if AbsencePeriode need to be deleted (soft delete enabled) => P -A +P P
       *   previous != A && next != A
       */
      if (
        previousAttendance?.state === 'ABSENT' &&
        nextAttendance?.state === 'ABSENT'
      ) {
        // case 5 if AbsencePeriod need to be split
        console.log('case 5 if AbsencePeriod need to be split');

        const lastAbsence = await prisma.attendance.findFirst({
          where: {
            date: {
              // less than or equal to
              lte: attendanceDate,
            },
            studentId: item.studentId,
            academicYearId: academicYear.id,
            state: 'ABSENT',
          },
          orderBy: {
            date: 'desc',
          },
        });
        const firstAbsence = await prisma.attendance.findFirst({
          where: {
            date: {
              // greater than or equal to
              gte: attendanceDate,
            },
            studentId: item.studentId,
            academicYearId: academicYear.id,
            state: 'ABSENT',
          },
          orderBy: {
            date: 'asc',
          },
        });

        if (currentAbsPeriod && lastAbsence && firstAbsence) {
          await prisma.absencePeriod.update({
            where: { id: currentAbsPeriod.id },
            data: {
              LastAbsence: {
                connect: {
                  id: lastAbsence.id,
                },
              },
            },
          });
          // create the second part of the absence period
          await prisma.absencePeriod.create({
            data: {
              FirstAbsence: {
                connect: {
                  id: firstAbsence.id,
                },
              },
              LastAbsence: {
                connect: {
                  id: currentAbsPeriod.LastAbsence.id,
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
        } else {
          await createAbsencePeriod({
            currentAttendance,
            item,
            academicYear,
          });
          console.error(
            'Absence period not found\nWhen trying to split absence period'
          );
        }
      } else if (
        previousAttendance?.state !== 'ABSENT' &&
        nextAttendance?.state === 'ABSENT'
      ) {
        console.log('Case 6: shorten absence period by the beginning');
        if (currentAbsPeriod) {
          await prisma.absencePeriod.update({
            where: { id: currentAbsPeriod.id },
            data: {
              FirstAbsence: {
                connect: {
                  id: nextAttendance.id,
                },
              },
            },
          });
        } else {
          await createAbsencePeriod({
            currentAttendance,
            item,
            academicYear,
          });
          console.error(
            'Absence period not found\nWhen trying to shorten absence period by the beginning'
          );
        }
      } else if (
        previousAttendance?.state === 'ABSENT' &&
        existingAttendance?.state === 'ABSENT' &&
        (nextAbsencePeriod === null || nextAttendance?.state !== 'ABSENT')
      ) {
        // Case 7: shorten absence period by the end
        console.log('Case 7: shorten absence period by the end');

        if (currentAbsPeriod) {
          await prisma.absencePeriod.update({
            where: { id: currentAbsPeriod.id },
            data: {
              LastAbsence: {
                connect: {
                  id: previousAttendance.id,
                },
              },
            },
          });
        } else {
          await createAbsencePeriod({
            currentAttendance,
            item,
            academicYear,
          });
          console.error(
            'Absence period not found\nWhen trying to shorten absence period by the end'
          );
        }
      } else if (
        currentAbsPeriod &&
        previousAttendance?.state !== 'ABSENT' &&
        nextAttendance?.state !== 'ABSENT'
      ) {
        // Case 8: delete absence period
        console.log('Case 8: delete absence period');

        if (currentAbsPeriod) {
          await prisma.absencePeriod.update({
            where: { id: currentAbsPeriod.id },
            data: {
              enabled: false,
            },
          });
        } else {
          await createAbsencePeriod({
            currentAttendance,
            item,
            academicYear,
          });
          console.error(
            'Absence period not found\nWhen trying to delete absence period'
          );
        }
      } else {
        console.warn('Any case matched');
      }
    }
  }

  const groupData = await getGroupWithStudentsAndAttendance({
    groupId,
    timeSlotId,
    date,
  });

  return Response.json(
    {
      data: groupData,
    },
    { status: 200 }
  );
};
