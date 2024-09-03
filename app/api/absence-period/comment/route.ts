import prisma from '@/lib/prisma';

// use response.json()
export const POST = async (req: Request): Promise<Response> => {
  try {
    const { comment, absencePeriodId, userId } = await req.json().catch(() => {
      throw new Error('Invalid request body');
    });

    if (!comment || typeof comment !== 'string') {
      throw new Error('Invalid comment');
    }

    if (!absencePeriodId || typeof absencePeriodId !== 'number') {
      throw new Error('Invalid absencePeriodId');
    }

    if (!userId || typeof userId !== 'number') {
      throw new Error('Invalid userId');
    }

    const absencePeriod = await prisma.absencePeriod.findUnique({
      where: { id: absencePeriodId },
    });

    if (!absencePeriod) {
      throw new Error('Absence period not found');
    }

    const user = await prisma.user.findUnique({
      where: { id: userId },
    });

    if (!user) {
      throw new Error('User not found');
    }

    await prisma.absencePeriodComment.create({
      data: {
        comment,
        absencePeriodId,
        userId,
      },
    });

    const comments = await prisma.absencePeriodComment.findMany({
      where: { absencePeriodId },
      include: { User: { select: { firstName: true, lastName: true } } },
      orderBy: { createdAt: 'desc' },
    });

    return Response.json({ data: comments });
  } catch (error: any) {
    return Response.json({ error: error.message }, { status: 400 });
  }
};
