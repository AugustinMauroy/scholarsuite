import prisma from '@/lib/prisma';

export const PATCH = async (req: Request): Promise<Response> => {
  const { id, processed } = await req.json();

  const presence = await prisma.presence.update({
    where: { id },
    data: { processed },
  });

  return Response.json({ data: presence }, { status: 200 });
};
