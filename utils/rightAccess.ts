import { getServerSession } from 'next-auth';
import nextAuthConfig from '@/lib/auth';
import prisma from '@/lib/prisma';

type Access = 'all' | 'api' | string;
/**
 * Note: use "all" is a bad practice
 * it's can be use-full for testing
 */
const rightAccess = async (
  authorized: Access[],
  req?: Request
): Promise<boolean> => {
  if (authorized.includes('all')) return true;

  if (req) {
    try {
      const body = await req.json();
      if (body) {
        const { apiKey } = body;
        if (!apiKey || typeof apiKey !== 'string') return false;

        const api = await prisma.apiKey.findUnique({
          where: {
            key: apiKey,
          },
        });

        if (!api) return false;

        return true;
      }
    } catch {
      return false;
    }
  }

  const session = await getServerSession(nextAuthConfig);
  if (!session) return false;

  const userPermission = await prisma.userPermission.findMany({
    where: {
      userId: session.user.id,
    },
    include: {
      permission: true,
    },
  });

  if (userPermission.length === 0) return false;

  const permission = userPermission.map(p => p.permission.name);

  for (const p of permission) {
    if (authorized.includes(p)) return true;
  }

  return false;
};

export default rightAccess;
