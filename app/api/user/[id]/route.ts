import prisma from '@/lib/prisma';
import rightAcces from '@/utils/rightAcces';

type Params = {
  params: {
    id: string;
  };
};

export const PATCH = async (
  req: Request,
  { params }: Params
): Promise<Response> => {
  if (!(await rightAcces(['ADMIN'])))
    return Response.json({ error: 'Unauthorized' }, { status: 401 });

  const body = await req.json();

  if (!body) return Response.json({ error: 'No body' }, { status: 400 });
  if (!body.firstName && !body.lastName)
    return Response.json(
      {
        error:
          'Missing firstName and lastName \n You must provide a first name and a last name',
      },
      { status: 400 }
    );

  if (Number.isNaN(Number(params.id)))
    return Response.json({ error: 'Invalid id' }, { status: 400 });

  const user = await prisma.user.update({
    where: { id: Number(params.id) },
    data: {
      firstName: body.firstName,
      lastName: body.lastName,
      email: body.email,
      enabled: body.enabled,
    },
  });

  return Response.json({ data: user }, { status: 200 });
};
