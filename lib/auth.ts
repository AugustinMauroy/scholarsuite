import CredentialsProvider from 'next-auth/providers/credentials';
import prisma from '@/lib/prisma';
import type { NextAuthOptions } from 'next-auth';

const nextAuthConfig = {
  providers: [
    CredentialsProvider({
      name: 'Credentials',
      credentials: {
        firstName: { label: 'First Name', type: 'text' },
        lastName: { label: 'Last Name', type: 'text' },
        password: { label: 'Password', type: 'password' },
      },
      async authorize(credentials) {
        if (
          !credentials ||
          !credentials.firstName ||
          !credentials.lastName ||
          !credentials.password
        ) {
          return null;
        }

        const user = await prisma.user.findFirst({
          where: {
            firstName: credentials.firstName,
            lastName: credentials.lastName,
            password: credentials.password,
          },
        });

        if (!user) return null;

        return {
          id: user.id.toString(),
          name: user.firstName,
        };
      },
    }),
  ],
  callbacks: {
    session: async ({ session }) => {
      // function to transform session object
      // next-auth to our custom schema
      if (!session.user.name) return null;

      const userFound = await prisma.user.findFirst({
        where: {
          firstName: session.user.name,
        },
      });

      if (!userFound) return null;

      session = { ...session, user: { ...userFound } };

      return Promise.resolve(session);
    },
  },
} as NextAuthOptions;

export default nextAuthConfig;
