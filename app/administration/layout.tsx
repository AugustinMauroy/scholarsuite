import { notFound } from 'next/navigation';
import rightAcces from '@/utils/rightAcces';
import type { FC, PropsWithChildren } from 'react';

const Layout: FC<PropsWithChildren> = async ({ children }) => {
  if (!(await rightAcces(['ADMIN']))) notFound();

  return <>{children}</>;
};

export default Layout;
