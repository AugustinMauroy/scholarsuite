import { join } from 'node:path';
import { readFile, readdir, writeFile, mkdir, rm } from 'node:fs/promises';

type Params = {
  params: { slug: string };
};

export const GET = async (req: Request, { params }: Params) => {
  const directory = join(process.cwd(), 'content', 'profile-picture');
  const files = await readdir(directory);
  const file = files.find(file => file.startsWith(params.slug));

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
    return new Response('Not Found', { status: 404 });
  }
};

export const POST = async (req: Request, { params }: Params) => {
  const contentType = req.headers.get('Content-Type');

  if (!contentType || !contentType.startsWith('image/')) {
    return new Response('Bad Request', { status: 400 });
  }

  const directory = join(process.cwd(), 'content', 'profile-picture');
  const files = await readdir(directory);
  const alreadyExists = files.some(file => file.startsWith(params.slug));

  if (alreadyExists) {
    const filePath = join(
      directory,
      files.find(file => file.startsWith(params.slug))!
    );

    try {
      await rm(filePath);
    } catch {
      return new Response('Internal Server Error', { status: 500 });
    }
  }

  try {
    const filepath = join(
      directory,
      `${params.slug}.${contentType.split('/').pop()}`
    );
    const file = await req.blob();

    await mkdir(directory, { recursive: true });
    await writeFile(filepath, Buffer.from(await file.arrayBuffer()));

    return new Response('OK');
  } catch {
    return new Response('Internal Server Error', { status: 500 });
  }
};
