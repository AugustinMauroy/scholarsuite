import { auth } from '@/lib/auth';
import prisma from '@/lib/prisma';
import { encode } from '@/utils/crypto';

export const GET = async (): Promise<Response> => {
  const session = await auth();

  if (!session)
    return Response.json({ error: 'Unauthorized' }, { status: 401 });
  if (session.user.role !== 'ADMIN')
    return Response.json({ error: 'Unauthorized (bad role)' }, { status: 401 });

  const users = await prisma.user.findMany({
    select: {
      id: true,
      firstName: true,
      lastName: true,
      email: true,
      role: true,
      enabled: true,
    },
  });

  return Response.json({ data: users });
};

export const PUT = async (req: Request): Promise<Response> => {
  const session = await auth();

  if (!session)
    return Response.json({ error: 'Unauthorized' }, { status: 401 });
  if (session.user.role !== 'ADMIN')
    return Response.json({ error: 'Unauthorized (bad role)' }, { status: 401 });

  const { firstName, lastName, email, role } = await req.json();

  if ((!firstName && !lastName) || !role)
    return Response.json({ error: 'Missing fields' }, { status: 400 });

  const password = await encode(
    `${firstName[0]}${lastName}`.toLocaleLowerCase()
  );

  const user = await prisma.user.create({
    data: {
      firstName:
        firstName.charAt(0).toUpperCase() + firstName.slice(1).toLowerCase(),
      lastName:
        lastName.charAt(0).toUpperCase() + lastName.slice(1).toLowerCase(),
      email: email,
      role: role,
      password,
    },
  });

  return Response.json({ data: user });
};
