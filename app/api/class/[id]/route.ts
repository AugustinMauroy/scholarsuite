import prisma from '@/lib/prisma';

type Params = {
  params: Promise<{
    id: string;
  }>;
};

export const PATCH = async (
  req: Request,
  { params }: Params
): Promise<Response> => {
  const { id } = await params;
  const { name } = await req.json();

  const updatedClass = await prisma.class.update({
    where: { id: parseInt(id, 10) },
    data: { name },
  });

  return Response.json({ class: updatedClass }, { status: 200 });
};
