import NextAuth from 'next-auth';
import type { User } from '@prisma/client';

declare module 'next-auth' {
  interface Session {
    user: {
      name?: string | null;
      email?: string | null;
      image?: string | null;
    } & User;
  }
}
