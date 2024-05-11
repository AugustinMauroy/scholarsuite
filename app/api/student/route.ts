import prisma from '@/lib/prisma';
import { uploadStudentPicture } from '@/utils/contentApi';

export const PUT = async (req: Request) => {
  const formData = await req.formData();
  const firstName = formData.get('firstName') as string;
  const lastName = formData.get('lastName') as string;
  const email = formData.get('email') as string;
  const file = formData.get('file') as File;

  if (!firstName || !lastName)
    return Response.json({ error: 'Missing required fields' }, { status: 400 });

  const student = await prisma.student.create({
    data: {
      firstName:
        firstName.charAt(0).toUpperCase() + firstName.slice(1).toLowerCase(),
      lastName:
        lastName.charAt(0).toUpperCase() + lastName.slice(1).toLowerCase(),
      contactEmail: email.length > 0 ? email : null,
    },
  });

  if (!file) {
    return Response.json(
      {
        data: student,
      },
      { status: 201 }
    );
  }

  return uploadStudentPicture({
    contentType: file.type.split('/').pop() ?? 'png',
    slug: student.id.toString(),
    file: file,
  });
};
