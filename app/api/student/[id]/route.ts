import prisma from '@/lib/prisma';
import { uploadStudentPicture } from '@/utils/contentApi';

type Params = {
  params: { id: string };
};

export const PATCH = async (req: Request, { params }: Params) => {
  const { id } = params;
  const formData = await req.formData();
  const firstName = formData.get('firstName') as string;
  const lastName = formData.get('lastName') as string;
  const classId = formData.get('classId') as string;
  const contactEmail = formData.get('contactEmail') as string;
  const enabled = formData.get('enabled') === 'true';
  const file = formData.get('file') as File | null;

  const student = await prisma.student.update({
    include: { class: true },
    where: { id: parseInt(id, 10) },
    data: {
      firstName,
      lastName,
      classId: parseInt(classId, 10),
      contactEmail,
      enabled,
    },
  });

  if (file) {
    const resp = await uploadStudentPicture({
      contentType: file.type,
      slug: student.id.toString(),
      file,
    });

    if (!resp.ok) {
      return resp;
    }
  }

  return Response.json({ student }, { status: 200 });
};
