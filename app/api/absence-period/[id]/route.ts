import prisma from '@/lib/prisma';

type Params = {
  params: Promise<{
    id: string;
  }>;
};

export const POST = async (
  req: Request,
  { params }: Params
): Promise<Response> => {
  const {} = await req.json().catch(() => ({}));
  const { id } = await params;

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
      Comments: {
        include: {
          User: true,
        },
      },
    },
  });

  return Response.json({ data: absence });
};
