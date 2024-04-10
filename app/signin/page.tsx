'use client';
import { useRouter } from 'next/navigation';
import { signIn, useSession } from 'next-auth/react';
import Input from '@/components/Common/Input';
import Button from '@/components/Common/Button';
import type { FC, FormEvent } from 'react';

const Page: FC = () => {
  const router = useRouter();
  const { data: session } = useSession();

  if (session) {
    router.push('/');
  }

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const firstName = formData.get('firstName') as string;
    const lastName = formData.get('lastName') as string;
    const password = formData.get('password') as string;
    await signIn('credentials', { firstName, lastName, password });
  };

  return (
    <main className="flex h-screen w-screen flex-col items-center justify-center gap-8">
      <h1 className="text-center text-6xl font-bold">
        Veillez-vous authentifier
      </h1>
      <form
        className="flex w-2/3 flex-col gap-2 lg:w-1/3 lg:gap-4"
        onSubmit={handleSubmit}
      >
        <Input label="First Name" placeholder="First Name" name="firstName" />
        <Input label="Last Name" placeholder="Last Name" name="lastName" />
        <Input
          label="Password"
          placeholder="Password"
          type="password"
          name="password"
        />
        <Button type="submit" className="mt-4">
          Connexion
        </Button>
      </form>
    </main>
  );
};

export default Page;
