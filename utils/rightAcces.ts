import { auth } from '@/lib/auth';
import prisma from '@/lib/prisma';
import type { Role } from '@prisma/client';

type Acces = Role | 'all' | 'api';
/**
 * Note: use "all" is a bad practice
 * it's can be usefull for dev but not for production
 */
const rightAcces = async (
  authorized: Acces[],
  req?: Request
): Promise<boolean> => {
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

  const session = await auth();
  if (!session) return false;

  const { role } = session.user;
  if (authorized.includes(role)) return true;

  return false;
};

export default rightAcces;
