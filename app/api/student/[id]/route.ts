import prisma from '@/lib/prisma';

type Params = {
  params: { id: string };
};

export const PATCH = async (req: Request, { params }: Params) => {
  const { id } = params;
  const { firstName, lastName, classId } = await req.json();

  const student = await prisma.student.update({
    where: { id: parseInt(id, 10) },
    data: { firstName, lastName, classId: parseInt(classId, 10) },
  });

  return Response.json({ student }, { status: 200 });
};