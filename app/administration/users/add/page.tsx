'use client';
import { useState } from 'react';
import Button from '@/components/Common/Button';
import Input from '@/components/Common/Input';
import Select from '@/components/Common/Select';
import BaseLayout from '@/components/Layout/Base';
import { useToast } from '@/hooks/useToast';
import styles from './page.module.css';
import type { User } from '@prisma/client';
import type { FC, FormEvent } from 'react';

const Page: FC = () => {
  const toast = useToast();
  // type user but without "enabled" and "id"
  const [user, setUser] = useState<
    Pick<User, 'firstName' | 'lastName' | 'email'> & {
      role: User['role'] | null;
    }
  >({
    firstName: '',
    lastName: '',
    email: '',
    role: null,
  });

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (
      !user.firstName ||
      !user.lastName ||
      !user.email ||
      user.role === null
    ) {
      toast({
        message: (
          <>
            {user.firstName === '' && <li>First name</li>}
            {user.lastName === '' && <li>Last name</li>}
            {user.email === '' && <li>Email</li>}
            {user.role === null && <li>Role</li>}
          </>
        ),
        kind: 'error',
      });

      return;
    }

    const response = await fetch('/api/user', {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(user),
    });

    await response.json().then(data => {
      if (data.error) {
        toast({
          message: data.error,
          kind: 'error',
        });
      } else {
        toast({
          message: 'User added',
          kind: 'success',
        });
        setUser({
          firstName: '',
          lastName: '',
          email: '',
          role: null,
        });
      }
    });
  };

  return (
    <BaseLayout sectionClassName={styles.formWrapper} title="Add User">
      <form onSubmit={handleSubmit}>
        <Input
          label="First Name"
          value={user.firstName}
          onChange={e => setUser({ ...user, firstName: e.target.value })}
        />
        <Input
          label="Last Name"
          value={user.lastName}
          onChange={e => setUser({ ...user, lastName: e.target.value })}
        />
        <Input
          label="Email"
          value={user.email}
          onChange={e => setUser({ ...user, email: e.target.value })}
        />
        <Select
          inline
          label="Role"
          onChange={v => setUser({ ...user, role: v as User['role'] })}
          values={[
            { value: 'ADMIN', label: 'Admin' },
            { value: 'TEACHER', label: 'Teacher' },
          ]}
        />
        <Button type="submit">Ajouter</Button>
      </form>
    </BaseLayout>
  );
};

export default Page;
