import prisma from '@/lib/prisma';

type Params = {
  params: {
    id: string;
  };
};

export const POST = async (
  req: Request,
  { params: { id } }: Params
): Promise<Response> => {
  const {} = await req.json().catch(() => ({}));

  if (!id || isNaN(Number(id)))
    return Response.json({ error: 'Invalid ID' }, { status: 400 });

  const absence = await prisma.absencePeriod.findUnique({
    where: {
      id: Number(id),
    },
    include: {
      Student: {
        include: {
          Class: true,
        },
      },
      FirstAbsence: {
        include: {
          Group: true,
          TimeSlot: true,
        },
      },
      LastAbsence: {
        include: {
          Group: true,
          TimeSlot: true,
        },
      },
      NextPresence: {
        include: {
          TimeSlot: true,
        },
      },
      Comments: {
        include: {
          User: true,
        },
      },
    },
  });

  return Response.json({ data: absence });
};
