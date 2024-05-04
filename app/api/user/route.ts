import { getServerSession } from 'next-auth';
import prisma from '@/lib/prisma';
import nextAuthConfig from '@/lib/auth';

export const GET = async (req: Request): Promise<Response> => {
  const session = await getServerSession(nextAuthConfig);

  if (!session)
    return Response.json({ error: 'Unauthorized' }, { status: 401 });
  if (session.user.role !== 0)
    return Response.json({ error: 'Unauthorized (bad role)' }, { status: 401 });

  const users = await prisma.user.findMany({
    select: {
      id: true,
      firstName: true,
      lastName: true,
      email: true,
      role: true,
    },
  });

  return Response.json({ data: users });
};

export const PUT = async (req: Request): Promise<Response> => {
  const session = await getServerSession(nextAuthConfig);

  if (!session)
    return Response.json({ error: 'Unauthorized' }, { status: 401 });
  if (session.user.role !== 0)
    return Response.json({ error: 'Unauthorized (bad role)' }, { status: 401 });

  const { firstName, lastName, email, role } = await req.json();

  if ((!firstName && !lastName) || !role)
    return Response.json({ error: 'Missing fields' }, { status: 400 });

  const user = await prisma.user.create({
    data: {
      firstName:
        firstName.charAt(0).toUpperCase() + firstName.slice(1).toLowerCase(),
      lastName:
        lastName.charAt(0).toUpperCase() + lastName.slice(1).toLowerCase(),
      email: !email ? null : (email as string | null),
      role: parseInt(role, 10) as number,
      password: `${firstName.charAt(0).toLowerCase()}${lastName.toLowerCase()}`,
    },
  });

  return Response.json({ data: user });
};
