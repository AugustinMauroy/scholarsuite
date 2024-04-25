import { join } from 'node:path';
import { writeFile, mkdir } from 'node:fs/promises';
import prisma from '@/lib/prisma';

export const GET = async (req: Request) => {
  const students = await prisma.student.findMany();

  return new Response(JSON.stringify(students), {
    headers: {
      'Content-Type': 'application/json',
    },
  });
};

export const PUT = async (req: Request) => {
  const formData = await req.formData();
  const firstName = formData.get('firstName') as string;
  const lastName = formData.get('lastName') as string;
  const file = formData.get('file') as File;

  if (!firstName || !lastName || !file) {
    return new Response('Missing required fields', { status: 400 });
  }

  const student = await prisma.student.create({
    data: {
      firstName,
      lastName,
    },
  });

  const directory = join(process.cwd(), 'content', 'student-picture');

  try {
    await mkdir(directory, {
      recursive: true,
    });

    const filepath = join(
      directory,
      `${student.id}.${file.type.split('/').pop()}`
    );

    await writeFile(filepath, Buffer.from(await file.arrayBuffer()));

    return new Response(JSON.stringify(student), {
      headers: {
        'Content-Type': 'application/json',
      },
    });
  } catch {
    return new Response('Internal Server Error', { status: 500 });
  }
};