import { getServerSession } from 'next-auth';
import prisma from '@/lib/prisma';
import nextAuthConfig from '@/lib/auth';

export const GET = async (req: Request): Promise<Response> => {
  const session = await getServerSession(nextAuthConfig);

  if (!session) {
    return new Response(null, { status: 401 });
  }

  const disciplinaryReports = await prisma.disciplinaryReport.findMany({
    where: {
      createdById: session.user.id,
    },
    include: {
      createdBy: true,
      student: true,
    },
  });

  return Response.json({ disciplinaryReports }, { status: 200 });
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
      student: {
        connect: {
          id: studentId,
        },
      },
      createdBy: {
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
