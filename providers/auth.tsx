'use client';
import { SessionProvider } from 'next-auth/react';
import type { FC, PropsWithChildren } from 'react';

const AuthProvider: FC<PropsWithChildren> = ({ children }) => (
  <SessionProvider>{children}</SessionProvider>
);

export default AuthProvider;
