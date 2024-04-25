import { join } from 'node:path';
import { readFile, readdir, writeFile, mkdir, rm } from 'node:fs/promises';
import prisma from '@/lib/prisma';

type Params = {
  params: { id: string };
};

export const GET = async (req: Request, { params }: Params) => {
  if (!params.id || parseInt(params.id) < 1)
    return new Response('Bad Request', { status: 400 });
  const student = await prisma.student.findUnique({
    where: { id: parseInt(params.id) },
  });

  if (!student) {
    return new Response('Not Found', { status: 404 });
  }

  const directory = join(process.cwd(), 'content', 'student-picture');

  const files = await readdir(directory).catch(() => []);

  const file = files.find(file => file.startsWith(params.id));

  if (!file) {
    return new Response('Not Found', { status: 404 });
  }

  const filepath = join(directory, file);

  try {
    const file = await readFile(filepath);

    return new Response(file, {
      headers: {
        'Content-Type': `image/${filepath.split('.').pop()}`,
      },
    });
  } catch {
    return new Response('Internal Server Error', { status: 500 });
  }
};
