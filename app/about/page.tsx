import { readFile } from 'fs/promises';
import Environment from '@/components/Common/Environement';
import BaseLayout from '@/components/Layout/Base';
import type { FC } from 'react';

const Page: FC = async () => {
  const license = await readFile('LICENSE', 'utf-8');

  return (
    <BaseLayout sectionClassName="flex flex-col items-start justify-center h-full gap-4">
      <span className="flex flex-row gap-2">
        <h2 className="text-2xl font-bold">Environment:</h2>
        <Environment forceDisplay />
      </span>
      <details className="w-full transition-all duration-300 ease-in-out">
        <summary>{license.split('\n')[0]}</summary>
        <pre className="rounded-md border border-gray-200 p-2 dark:border-gray-800">
          {license.split('\n').slice(1).join('\n')}
        </pre>
      </details>
    </BaseLayout>
  );
};

export default Page;
