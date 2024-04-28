import prisma from '@/lib/prisma';

export const POST = async (req: Request) => {
  const { string } = await req.json();

  if (!string) {
    return Response.json({
      error: 'Please provide a string',
    });
  }

  const response = await prisma.student.findMany({
    where: {
      OR: [
        {
          firstName: {
            contains: string,
          },
        },
        {
          lastName: {
            contains: string,
          },
        },
      ],
    },
    include: {
      class: true,
    },
  });

  return Response.json(response);
};
