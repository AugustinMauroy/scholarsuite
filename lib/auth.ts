import NextAuth from 'next-auth';
import Credentials from 'next-auth/providers/credentials';
import Github from 'next-auth/providers/github';
import GitLab from 'next-auth/providers/gitlab';
import Discord from 'next-auth/providers/discord';
import Google from 'next-auth/providers/google';
import { encode } from '@/utils/crypto';
import type { Provider } from 'next-auth/providers';

export const providers: Provider[] = [
  Github,
  GitLab,
  Google,
  Discord,
  Credentials({
    name: 'Credentials',
    credentials: {
      email: { label: 'Email', type: 'email' },
      password: { label: 'Password', type: 'password' },
    },
    async authorize(credentials) {
      if (!credentials.email || !credentials.password) return null;

      const psw = await encode(credentials.password as string);

      const resp = await fetch('http://localhost:3000/api/auth-utils', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email: credentials.email,
          password: psw,
        }),
      });
      const data = await resp.json();

      const error = data.error;
      if (error) return null;

      const user = data.data;

      // specify name as something understandable
      return {
        ...user,
        id: user.id.toString(),
        name: `${user.firstName}/${user.lastName}`,
      };
    },
  }),
];

const disponibleProviders = providers.map(provider => {
  // check if process.env has the required AUTH_[PROVIDER]_ID
  const providerId = process.env[`AUTH_${provider.name.toUpperCase()}_ID`];
  const providerSecret = process.env[`AUTH_${provider.name.toUpperCase()}_SECRET`];

  if (providerId && providerSecret) return provider;
})
.filter(provider => provider);

export const providerMap = disponibleProviders
  .map(provider => {
    if (typeof provider === 'function') {
      const providerData = provider();

      return { id: providerData.id, name: providerData.name };
    } else {
      return { id: provider?.id, name: provider?.name };
    }
  })
  .filter(provider => provider.id !== 'credentials');

export const { handlers, signIn, signOut, auth } = NextAuth({
  session: { strategy: 'jwt' },
  callbacks: {
    async signIn(params) {
      const resp = await fetch('http://localhost:3000/api/auth-utils', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email: params.profile?.email ?? params.user.email ?? '',
        }),
      });
      const data = await resp.json();
      if (data.error) return false;
      const user = data.data;

      return user ? true : false;
    },
    async session({ session }) {
      const resp = await fetch('http://localhost:3000/api/auth-utils', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email: session.user.email,
        }),
      });
      const data = await resp.json();
      if (data.error) return session;
      const userFound = data.data;

      return {
        ...session,
        user: {
          ...session.user,
          ...userFound,
          id: userFound?.id.toString(),
          image:
            session.user.image ??
            `http://localhost:3000/api/content/profile-picture/${userFound?.firstName}${userFound?.lastName}`,
          name: `${userFound?.firstName} ${userFound?.lastName}`,
        },
      };
    },
  },
  providers,
  pages: {
    signIn: '/signin',
  },
});
