import prisma from '@/lib/prisma';
import { getValue } from '@/utils/timeslot';
import type { Attendance, AcademicYear, TimeSlot } from '@prisma/client';
import type { PatchBody } from '@/types/attendance';

type createAbsencePeriodProps = {
  item: PatchBody['data'][0];
  currentAttendance: Attendance;
  academicYear: AcademicYear;
};

function createAbsencePeriod({
  currentAttendance,
  item,
  academicYear,
}: createAbsencePeriodProps) {
  return prisma.absencePeriod.create({
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

type GetAttendanceProps = {
  item: PatchBody['data'][0];
  currentTimeSlot: TimeSlot;
  date: Date;
};

function getCurrentAttendance({
  item,
  currentTimeSlot,
  date,
}: GetAttendanceProps) {
  return prisma.attendance.findFirst({
    where: {
      date: {
        gte: new Date(date.getFullYear(), date.getMonth(), date.getDate()),
        lt: new Date(date.getFullYear(), date.getMonth(), date.getDate() + 1),
      },
      timeSlotId: currentTimeSlot.id,
      studentId: item.studentId,
    },
  });
}

// API where we process attendance from `/group-attendance/[id]`
export const PATCH = async (req: Request): Promise<Response> => {
  const body: PatchBody = await req.json().catch(() => null);

  if (!body) {
    return Response.json({ error: 'invalid body' }, { status: 400 });
  }

  const { data, groupId } = body;
  const timeSlotId = Number(body.timeSlotId);
  const userId = Number(body.userId);
  const date = new Date(body.date);

  if (Number.isNaN(timeSlotId) || Number.isNaN(userId) || !date) {
    return Response.json({ error: 'invalid body' }, { status: 400 });
  }

  if (!data || timeSlotId === undefined || userId === undefined || !date) {
    return Response.json({ error: 'missing required fields' }, { status: 400 });
  }

  const currentTimeSlot = await prisma.timeSlot.findUnique({
    where: { id: timeSlotId },
  });

  if (!currentTimeSlot) {
    return Response.json({ error: 'timeslot not found' }, { status: 404 });
  }
  const { hour: timeSlotHour, minute: timeSlotMinute } = getValue(
    currentTimeSlot.startTime
  );

  const academicYear = await prisma.academicYear.findFirst({
    where: {
      current: true,
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

    let currentAttendance = await getCurrentAttendance({
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
    if (currentAttendance) {
      await prisma.attendance.update({
        where: { id: currentAttendance.id },
        data: { ...item, userId: userId },
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
    currentAttendance = await getCurrentAttendance({
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
     * de la même année académique dont la première présence est inférieure ou égale à la date de la présence
     * et la dernière présence est supérieure ou égale à la date de la présence
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
     * Pour trouver la prochaine présence, c'est rechercher la présence pour l'étudiant
     * de la même année académique dont la date minimum qui est strictement supérieure à la date de la présence
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

    if (item.state === 'ABSENT') {
      /**
       * - Case 1: if no past Absenceperiode needed to create => P +A || P -P +A P || +A P
       *   (previous = null && next = null) ||
       *   (previous = P && next = null) ||
       *   (previous = null && next = P) ||
       *   (previous != a && next != a)
       *   Action:
       *    - Check if period already exists => CurrentAbsencePeriod.first.date <= attendance.date && attendance.date <= CurentAbsencePeriod.last.date
       *    - if exists update it and log the change
       *    - if not create it
       *
       * - case 2: if to extend by begin => P +A A
       *   previous = P && next = A && current = A
       *   Action:
       *    - Check if nextPeriod already exists
       *    - if not found create it and log error
       *    - if found update
       *
       * - case 3: if to extend by the end => A + A +P
       *   previous = A && next != A && current = A
       *   Action:
       *    - Check if previousPeriod already exists
       *    - if not found create it and log error
       *    - if found update
       *
       * - case 4: If need to merge with the previous Absenceperiode, delete next absPeroid => A -P +A A
       *   previous = A && next = A && current = A
       *   Action:
       *    - if previous doesn't exist create it (log)
       *    - else update previous
       *    - if next doesn't (log)
       *    - else soft delete the next period
       *
       * Dans les actions, on ne peut PAS étendre par le début, étendre par la fin ou merger des périodes d’absence déjà justifiées (positivement ou injustifié).
       * Dans ce cas, il faut juste créer une nouvelle période d’absence.
       */
      if (
        (!previousAttendance && !nextAttendance) ||
        (previousAttendance?.state !== 'ABSENT' && !nextAttendance) ||
        (!previousAttendance && nextAttendance?.state !== 'ABSENT') ||
        (previousAttendance?.state !== 'ABSENT' &&
          nextAttendance?.state !== 'ABSENT')
      ) {
        // Create new absence period
        console.log('case 1: create new absence period');
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
        console.log('case 2: extend by the beginning');
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
        // extend by the end
        console.log('case 3: extend by the end');
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
        nextAttendance?.state === 'ABSENT'
      ) {
        console.log(
          'case 4: merge with the previous Absenceperiode, delete next absPeroid'
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
       * - case 1: if AbsencePeriode need to be ended => P AAA + P
       *   previous = A && next != A && current != A
       *   Actions:
       *    - Check if currenTperiod already exists => preiodeAbsence.lastAttendance.date == presence.date
       *    - if exists update
       *    - if not create it and log error
       *
       * - case 2 if AbsencePeriode need to be split => P AAA +P AAA P
       *   previous = A && next = A && current = A
       *
       * - case 3: if AbsencePeriode need to be shortened by the beginning => P -A +P AAA P
       *   previous = (P || L) && next = A && current = A
       *
       * - case 4 if AbsencePeriode need to be shortened by the end => P AAA +P -A P
       *   previous = A && next = (P || L) && current = A
       *
       * - case 5: if AbsencePeriode need to be deleted (soft delete enabled) => P -A +P P
       *   previous != A  && next != A && current = A
       */
      if (
        previousAttendance?.state === 'ABSENT' &&
        nextAttendance?.state !== 'ABSENT'
      ) {
        console.log('Case 1: end absence period');
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
            'Absence period not found\nWhen trying to end absence period'
          );
        }
      } else if (
        previousAttendance?.state === 'ABSENT' &&
        nextAttendance?.state === 'ABSENT'
      ) {
        // split absence period
        console.log('Case 2: split absence period');
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
          // create new absence period
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
        // shorten absence period by the beginning
        console.log('Case 3: shorten absence period by the beginning');
        if (currentAbsPeriod) {
          await prisma.absencePeriod.update({
            where: { id: currentAbsPeriod.id },
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
            'Absence period not found\nWhen trying to shorten absence period by the beginning'
          );
        }
      } else if (
        previousAttendance?.state === 'ABSENT' &&
        (nextAttendance?.state === 'PRESENT' ||
          nextAttendance?.state === 'LATE')
      ) {
        // shorten absence period by the end
        console.log('Case 4: shorten absence period by the end');

        if (currentAbsPeriod) {
          await prisma.absencePeriod.update({
            where: { id: currentAbsPeriod.id },
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
            'Absence period not found\nWhen trying to shorten absence period by the end'
          );
        }
      } else if (
        currentAbsPeriod &&
        previousAttendance?.state !== 'ABSENT' &&
        nextAttendance?.state !== 'ABSENT'
      ) {
        // delete absence period
        console.log('Case 5: delete absence period');

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

  // @TODO: refracto to unsure there are no duplicate code
  // Don't send result back to client
  // But send fresh data to client
  // it's same as GET /api/group/[id]
  const now = new Date();
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

  // sort students by firstname
  groupData?.StudentGroup.sort((a, b) =>
    a.Student.firstName.localeCompare(b.Student.firstName)
  );

  return Response.json(
    {
      data: groupData,
    },
    { status: 200 }
  );
};
