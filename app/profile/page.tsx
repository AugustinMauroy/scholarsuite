// @todo: need to add logic to update the user profile
// for file there are routes `content/profile-picture/username`
'use client';
import * as DialogPrimitive from '@radix-ui/react-dialog';
import { useState } from 'react';
import { XMarkIcon } from '@heroicons/react/24/outline';
import { useSession } from 'next-auth/react';
import { getAcronymFromString } from '@/utils/string';
import Avatar from '@/components/Common/Avatar';
import Button from '@/components/Common/Button';
import type { FC, DragEvent } from 'react';

/**
 * @deprecated use it separate components
 */
const DropZone: FC = () => {
  const [file, setFile] = useState<File | null>(null);

  const handleDrop = (event: DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    const file = event.dataTransfer.files[0];
    setFile(file);
    console.log(file);
  };

  const handleClick = () => {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = 'image/*';
    input.onchange = event => {
      const file = (event.target as HTMLInputElement).files?.[0];
      if (file) {
        setFile(file);
        console.log(file);
      }
    };
    input.click();
  };

  return (
    <div
      onDragOver={event => event.preventDefault()}
      onDrop={handleDrop}
      onClick={handleClick}
      className="flex flex-col items-center justify-center gap-4 rounded-lg border-2 border-dashed p-4"
    >
      <h1>Drop Image Here</h1>
      {file && <p>{file.name}</p>}
    </div>
  );
};

const Page: FC = () => {
  const sessionData = useSession();

  const alt = getAcronymFromString(
    sessionData.data?.user?.firstName + ' ' + sessionData.data?.user?.lastName
  );

  return (
    <DialogPrimitive.Root>
      <section className="flex w-full flex-col items-center justify-center gap-4">
        <h1 className="text-4xl font-bold">Profile</h1>
        <div className="flex flex-col items-center justify-center gap-4">
          <Avatar
            src={sessionData.data?.user?.image || ''}
            alt={alt}
            className="!size-24 !text-3xl"
          />
          <p className="text-xl font-bold">
            Name: {sessionData.data?.user?.firstName}{' '}
            {sessionData.data?.user?.lastName}
          </p>
          <DialogPrimitive.Trigger asChild>
            <Button>Edit</Button>
          </DialogPrimitive.Trigger>
        </div>
      </section>
      <DialogPrimitive.Portal>
        <DialogPrimitive.Overlay className="fixed inset-0 bg-black bg-opacity-50" />
        <DialogPrimitive.Content className="fixed left-1/2 top-1/2 flex w-96 -translate-x-1/2 -translate-y-1/2 transform flex-col gap-4 rounded-lg bg-white p-4 shadow-lg dark:bg-gray-800">
          <DialogPrimitive.Close asChild>
            <XMarkIcon className="absolute right-4 top-4 size-8 cursor-pointer hover:text-red-500" />
          </DialogPrimitive.Close>
          <DialogPrimitive.Title asChild>
            <h2 className="text-2xl font-bold">Edit Profile</h2>
          </DialogPrimitive.Title>
          <DropZone />
          <DialogPrimitive.Close asChild>
            <Button kind="outline">Update</Button>
          </DialogPrimitive.Close>
        </DialogPrimitive.Content>
      </DialogPrimitive.Portal>
    </DialogPrimitive.Root>
  );
};

export default Page;
