import { getServerSession } from 'next-auth';
import Link from 'next/link';
import nextAuthConfig from '@/lib/auth';
import prisma from '@/lib/prisma';
import type { FC } from 'react';

const ClassNav: FC = async () => {
  const sessions = await getServerSession(nextAuthConfig);

  const teacherId = sessions?.user.id;

  if (!teacherId) return null;

  const schoolLevels = await prisma.schoolLevel.findMany({
    include: {
      classes: {
        where: {
          userId: teacherId,
        },
      },
    },
  });

  const navItems = schoolLevels.filter(level => level.classes.length > 0);

  return (
    <nav className="h-full w-fit bg-gray-800 p-4 text-white dark:bg-gray-900">
      <ul>
        {navItems.map(level => (
          <li key={level.id}>
            <span className="font-bold">{level.name}</span>
            <ul className="ml-4 list-disc">
              {level.classes.map(cls => (
                <li
                  key={cls.id}
                  className="hover:text-brand-400 hover:underline"
                >
                  <Link href={`/class/${cls.id}`}>{cls.name}</Link>
                </li>
              ))}
            </ul>
          </li>
        ))}
      </ul>
    </nav>
  );
};

export default ClassNav;
