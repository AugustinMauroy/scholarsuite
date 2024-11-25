import prisma from '@/lib/prisma';

type GetGroupWithStudentsAndAttendanceProps = {
  groupId: number;
  timeSlotId: number;
  date?: Date;
};

/**
 * Get a group with students and attendance for a specific date and timeSlot
 * Used to send data for `group-attendance` page
 */
export const getGroupWithStudentsAndAttendance = async ({
  groupId,
  timeSlotId,
  date = new Date(),
}: GetGroupWithStudentsAndAttendanceProps) =>
  prisma.group.findUnique({
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
                      date.getFullYear(),
                      date.getMonth(),
                      date.getDate()
                    ),
                    lt: new Date(
                      date.getFullYear(),
                      date.getMonth(),
                      date.getDate() + 1
                    ),
                  },
                  timeSlotId,
                },
              },
            },
          },
        },
        orderBy: {
          Student: {
            firstName: 'asc',
          },
        },
      },
    },
  });
