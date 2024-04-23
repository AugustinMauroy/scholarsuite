// @todo: need to test this route
// to do that we need to finish implementing the page profile
import { join } from 'node:path';
import { readFile, writeFile } from 'node:fs/promises';

type Params = {
  params: { slug: string };
};

export const GET = async (req: Request, { params }: Params) => {
  const filepath = join(
    process.cwd(),
    'content',
    'profile-picture',
    params.slug
  );

  try {
    const file = await readFile(filepath);

    return new Response(file, {
      headers: {
        'Content-Type': 'image/jpeg',
      },
    });
  } catch {
    return new Response('Not Found', { status: 404 });
  }
};

export const POST = async (req: Request, { params }: Params) => {
  const filepath = join(
    process.cwd(),
    'content',
    'profile-picture',
    params.slug
  );

  const file = await req.blob();

  try {
    await writeFile(filepath, await file.text());

    return new Response('OK');
  } catch {
    return new Response('Internal Server Error', { status: 500 });
  }
};
