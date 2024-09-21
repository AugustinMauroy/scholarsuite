import type { User } from '@prisma/client';

type Opp = 'add' | 'remove';

type Data = {
  opp: Opp;
  id: number;
};

export type UserPatch = {
  userId: User['id'];
  data: Array<Data>;
};

export type Patch = {
  id: number;
  data: Array<Data>;
};
