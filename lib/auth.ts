import CredentialsProvider from 'next-auth/providers/credentials';
import prisma from '@/lib/prisma';
import type { NextAuthOptions } from 'next-auth';

const nextAuthConfig = {
  providers: [
    CredentialsProvider({
      name: 'Credentials',
      credentials: {
        firstName: {},
        lastName: {},
        password: {},
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
          name: user.firstName + ' ' + user.lastName,
          image: `http://localhost:3000/api/content/profile-picture/${user.firstName + user.lastName}`,
        };
      },
    }),
  ],
  callbacks: {
    session: async ({ session }) => {
      const userFound = await prisma.user.findFirst({
        where: {
          id: session.user.id,
        },
      });

      if (!userFound) return null;

      session.user = {
        ...session.user,
        ...userFound,
      };

      return Promise.resolve(session);
    },
  },
  pages: {
    signIn: '/signin',
  },
} as NextAuthOptions;

export default nextAuthConfig;
