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
          name: user.firstName,
          // temporary image, will be replaced by the real one
          // using the `content/profile-picture/username`
          image: `https://ui-avatars.com/api/?name=${user.firstName}+${user.lastName}`,
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
  pages: {
    signIn: '/signin',
  },
} as NextAuthOptions;

export default nextAuthConfig;
