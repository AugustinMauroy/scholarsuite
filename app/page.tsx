import { getServerSession } from 'next-auth';
import BaseLayout from '@/components/Layout/Base';
import nextAuthConfig from '@/lib/auth';
import type { FC } from 'react';

const Page: FC = async () => {
  const session = await getServerSession(nextAuthConfig);

  const firstName = session?.user?.firstName;
  const lastName = session?.user?.lastName;

  return <BaseLayout title={`Welcome back, ${firstName} ${lastName}`} />;
};

export default Page;
