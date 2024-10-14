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
            mode: 'insensitive',
          },
        },
        {
          lastName: {
            contains: string,
            mode: 'insensitive',
          },
        },
      ],
      AND: {
        enabled: true,
      },
    },
    include: {
      Class: true,
    },
  });

  return Response.json(response);
};
