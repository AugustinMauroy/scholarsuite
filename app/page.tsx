'use client';
import { useSession } from 'next-auth/react';
import Link from 'next/link';
import { userRoles } from '@/utils/roles';
import type { FC } from 'react';

const Page: FC = () => {
  const { data: session } = useSession();
  if (!session) return null;

  // way to display a/an based on the role
  const displayRole =
    (userRoles[session.user.role].startsWith('a') ? 'an' : 'a') +
    ' ' +
    userRoles[session.user.role];

  return (
    <main className="m-4">
      <h1 className="text-6xl font-bold">Dashboard</h1>
      <p className="text-xl text-gray-600 dark:text-gray-400">
        Welcome, {`${session.user.firstName} ${session.user.lastName}`}! You are{' '}
        {displayRole}.
      </p>
      <ul className="m-4 list-disc">
        {session.user.role === 0 && (
          <li>
            <Link
              href="/administration"
              className="text-lg text-blue-500 hover:underline"
            >
              Administration Dashboard
            </Link>
          </li>
        )}
        <li>
          <Link
            href="/disciplinaryReport"
            className="text-lg text-blue-500 hover:underline"
          >
            Disciplinary Dashboard
          </Link>
        </li>
      </ul>
    </main>
  );
};

export default Page;
