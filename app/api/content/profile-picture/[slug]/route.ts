import { readFile, readdir } from 'node:fs/promises';
import { join } from 'node:path';
import { uploadProfilePicture } from '@/utils/contentApi';

type Params = {
  params: Promise<{ slug: string }>;
};

export const GET = async (req: Request, { params }: Params) => {
  const { slug } = await params;
  const directory = join(process.cwd(), 'content', 'profile-picture');
  const files = await readdir(directory).catch(() => []);
  const file = files.find(file => file.startsWith(slug));

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
  const { slug } = await params;

  if (!contentType || !contentType.startsWith('image/')) {
    return new Response('Bad Request', { status: 400 });
  }

  const file = await req.blob();

  return uploadProfilePicture({ contentType, slug: slug, file });
};
