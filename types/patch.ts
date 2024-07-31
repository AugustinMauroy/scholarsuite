type opp = 'add' | 'remove';

export type Patch = {
  id: number;
  data: {
    opp: opp;
    id: number;
  }[];
};
