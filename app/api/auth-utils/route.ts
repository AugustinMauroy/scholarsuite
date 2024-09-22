import prisma from '@/lib/prisma';
import { providerMap } from '@/lib/auth';

export const GET = async () =>
  Response.json(providerMap, {
    status: 200,
  });

export const POST = async (req: Request) => {
  const { email, password } = await req.json().catch(() => ({}));

  if (!email) {
    return Response.json(
      { error: 'Email and password are required' },
      {
        status: 400,
      }
    );
  }

  const user = await prisma.user.findFirst({
    where: {
      email,
      password,
    },
  });

  if (!user) {
    return Response.json(
      { error: 'Invalid credentials' },
      {
        status: 401,
      }
    );
  }

  return Response.json(
    {
      data: user,
    },
    {
      status: 200,
    }
  );
};
