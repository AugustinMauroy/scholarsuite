'use client';
import Link from 'next/link';
import { useSession } from 'next-auth/react';
import type { FC } from 'react';

const Page: FC = () => {
  const { data: session } = useSession();
  if (!session) return null;

  // way to display a/an based on the role
  const displayRole =
    (session.user.role.startsWith('a') ? 'an' : 'a') +
    ' ' +
    session.user.role.toLowerCase();

  return (
    <main className="m-4">
      <h1 className="text-3xl font-bold">Dashboard</h1>
      <p className="text-lg text-gray-600 dark:text-gray-400">
        Welcome, {`${session.user.firstName} ${session.user.lastName}`}! You are{' '}
        {displayRole}.
      </p>
      <ul className="m-4 list-disc">
        {session.user.role === 'ADMIN' && (
          <li>
            <Link
              href="/administration"
              className="text-lg text-brand-500 hover:underline"
            >
              Administration Dashboard
            </Link>
          </li>
        )}
        {session.user.role === 'MANAGER' && (
          <li>
            <Link
              href="/presence"
              className="text-lg text-brand-500 hover:underline"
            >
              Review Presence
            </Link>
          </li>
        )}
        <li>
          <Link
            href="/disciplinaryReport"
            className="text-lg text-brand-500 hover:underline"
          >
            Disciplinary Dashboard
          </Link>
        </li>
      </ul>
    </main>
  );
};

export default Page;
