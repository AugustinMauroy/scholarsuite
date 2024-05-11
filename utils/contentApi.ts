import { join } from 'node:path';
import { readdir, writeFile, mkdir, rm } from 'node:fs/promises';

type UpdloadProps = {
  contentType: string;
  slug: string;
  file: Blob;
};

export const uploadProfilePicture = async ({
  contentType,
  slug,
  file,
}: UpdloadProps): Promise<Response> => {
  const directory = join(process.cwd(), 'content', 'profile-picture');
  const files = await readdir(directory).catch(() => []);
  const alreadyExists = files.some(file => file.startsWith(slug));

  if (alreadyExists) {
    const filePath = join(
      directory,
      files.find(file => file.startsWith(slug))!
    );

    try {
      await rm(filePath);
    } catch {
      return new Response('Internal Server Error', { status: 500 });
    }
  }

  try {
    const filepath = join(directory, `${slug}.${contentType.split('/').pop()}`);

    await mkdir(directory, { recursive: true });
    await writeFile(filepath, Buffer.from(await file.arrayBuffer()));

    return new Response('OK');
  } catch {
    return new Response('Internal Server Error', { status: 500 });
  }
};

export const uploadStudentPicture = async ({
  contentType,
  slug,
  file,
}: UpdloadProps): Promise<Response> => {
  const directory = join(process.cwd(), 'content', 'student-picture');
  const files = await readdir(directory).catch(() => []);
  const alreadyExists = files.some(file => file.startsWith(slug));

  if (alreadyExists) {
    const filePath = join(
      directory,
      files.find(file => file.startsWith(slug))!
    );

    try {
      await rm(filePath);
    } catch {
      return new Response('Internal Server Error', { status: 500 });
    }
  }

  try {
    const filepath = join(directory, `${slug}.${contentType.split('/').pop()}`);

    await mkdir(directory, { recursive: true });
    await writeFile(filepath, Buffer.from(await file.arrayBuffer()));

    return new Response('OK');
  } catch {
    return new Response('Internal Server Error', { status: 500 });
  }
};
