import { readFile, readdir } from 'node:fs/promises';
import { join } from 'node:path';
import prisma from '@/lib/prisma';

type Params = {
  params: Promise<{ id: string }>;
};

export const GET = async (req: Request, { params }: Params) => {
  const { id } = await params;
  if (!id || parseInt(id) < 1)
    return new Response('Bad Request', { status: 400 });
  const student = await prisma.student.findUnique({
    where: { id: parseInt(id) },
  });

  if (!student) {
    return new Response('Not Found', { status: 404 });
  }

  const directory = join(process.cwd(), 'content', 'student-picture');

  const files = await readdir(directory).catch(() => []);

  const file = files.find(file => file.startsWith(id));

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
