import { getServerSession } from 'next-auth';
import nextAuthConfig from '@/lib/auth';
import prisma from '@/lib/prisma';

export const GET = async (req: Request): Promise<Response> => {
  const session = await getServerSession(nextAuthConfig);

  if (!session)
    return Response.json({ error: 'Unauthorized' }, { status: 401 });

  const userWithClasses = await prisma.user.findUnique({
    where: {
      id: session.user.id,
    },
    include: {
      UserClass: {
        include: {
          Class: {
            include: {
              Students: true,
            },
          },
        },
      },
    },
  });

  if (!userWithClasses)
    return Response.json({ error: 'User not found' }, { status: 404 });

  const studentIdsUnderTutelage = userWithClasses.UserClass.flatMap(
    cu => cu.Class.Students
  ).map(s => s.id);

  const disciplinaryReports = await prisma.disciplinaryReport.findMany({
    where: {
      studentId: {
        in: studentIdsUnderTutelage,
      },
    },
    include: {
      CreatedBy: true,
      Student: true,
    },
  });

  return Response.json({ data: disciplinaryReports }, { status: 200 });
};

export const POST = async (req: Request): Promise<Response> => {
  const session = await getServerSession(nextAuthConfig);

  if (!session) {
    return new Response(null, { status: 401 });
  }

  const { studentId, description, date } = await req.json();

  const disciplinaryReport = await prisma.disciplinaryReport.create({
    data: {
      description,
      date,
      Student: {
        connect: {
          id: studentId,
        },
      },
      CreatedBy: {
        connect: {
          id: session.user.id,
        },
      },
    },
  });

  /* @TODO: send email to student
    https://react.email
    https://nodemailer.com */

  return Response.json({ disciplinaryReport }, { status: 201 });
};
