import NextAuth from 'next-auth';
import type { User } from '@prisma/client';

declare module 'next-auth' {
  /**
   * Returned by `auth`, `useSession`, `getSession` and received as a prop on the `SessionProvider` React Context
   */
  interface Session {
    user: DefaultSession['user'] & User;
  }
}
