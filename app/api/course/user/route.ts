import prisma from '@/lib/prisma';

export const POST = async (req: Request) => {
  const { userId } = await req.json();

  if (!userId)
    return Response.json({ error: 'User ID is required' }, { status: 400 });

  const user = await prisma.user.findUnique({
    where: {
      id: userId,
    },
  });

  if (!user) return Response.json({ error: 'User not found' }, { status: 404 });

  const courses = await prisma.course.findMany({
    where: {
      userCourse: {
        some: {
          userId,
        },
      },
    },
  });

  return Response.json({ data: courses }, { status: 200 });
};
