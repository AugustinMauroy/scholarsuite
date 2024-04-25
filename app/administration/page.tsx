import Link from 'next/link';
import type { FC } from 'react';

const Page: FC = () => (
  <main className="px-4">
    <header className="mb-2 border-b-2 border-gray-200 pb-2">
      <h1 className="text-2xl font-bold">Administration</h1>
      <p className="text-gray-500">Manage your school</p>
    </header>
    <section className="flex flex-wrap gap-4">
      <div className="rounded bg-white p-4 shadow dark:bg-gray-800 dark:shadow-none">
        <h2 className="text-xl font-bold">Manage Students</h2>
        <Link
          href="/administration/students"
          className="block text-brand-500 hover:underline"
        >
          View Students
        </Link>
        <Link
          href="/administration/students/add"
          className="block text-brand-500 hover:underline"
        >
          Add Student
        </Link>
      </div>
      <div className="rounded bg-white p-4 shadow dark:bg-gray-800 dark:shadow-none">
        <h2 className="text-xl font-bold">Manage Classes</h2>
        <Link
          href="/administration/classes"
          className="block text-brand-500 hover:underline"
        >
          View Classes
        </Link>
        <Link
          href="/administration/classes/add"
          className="block text-brand-500 hover:underline"
        >
          Add Class
        </Link>
      </div>
    </section>
  </main>
);

export default Page;
