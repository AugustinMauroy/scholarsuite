type opp = 'add' | 'remove';

export type Patch = {
  userId: number;
  data: {
    opp: opp;
    id: number;
  }[];
};
