import { notFound } from 'next/navigation';
import rightAccess from '@/utils/rightAccess';
import type { FC, PropsWithChildren } from 'react';

const Layout: FC<PropsWithChildren> = async ({ children }) => {
  if (!(await rightAccess(['full_admin']))) notFound();

  return <>{children}</>;
};

export default Layout;
