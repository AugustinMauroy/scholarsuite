import prisma from '@/lib/prisma';

export const POST = async (req: Request) => {
  const { studentId } = await req.json();

  if (!studentId)
    return Response.json({ error: 'Student ID is required' }, { status: 400 });

  const student = await prisma.student.findUnique({
    where: {
      id: studentId,
    },
  });

  if (!student)
    return Response.json({ error: 'Student not found' }, { status: 404 });

  const courses = await prisma.course.findMany({
    where: {
      StudentCourse: {
        some: {
          studentId,
        },
      },
    },
  });

  return Response.json({ data: courses }, { status: 200 });
};
