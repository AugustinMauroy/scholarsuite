import prisma from '@/lib/prisma';

type GetGroupProps = {
  groupId: number;
  timeSlotId: number;
  date?: Date;
};

export const getGroup = async ({
  groupId,
  timeSlotId,
  date = new Date(),
}: GetGroupProps) => {
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
      },
    },
  });

  // sort students by firstname
  groupData?.StudentGroup.sort((a, b) =>
    a.Student.firstName.localeCompare(b.Student.firstName)
  );

  return groupData;
};
