import type { Prisma } from '@prisma/client';

export const BASE_PERMISSION = [
  {
    name: 'create_presence',
  },
  {
    name: 'full_admin',
  },
  {
    name: 'review_presence',
  },
  {
    name: 'disciplinaryReport',
  },
] as Prisma.PermissionCreateManyInput[];
