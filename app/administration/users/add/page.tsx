'use client';
import { useSession } from 'next-auth/react';
import { useState } from 'react';
import { notFound } from 'next/navigation';
import { useToast } from '@/hooks/useToast';
import Select from '@/components/Common/Select';
import Input from '@/components/Common/Input';
import Button from '@/components/Common/Button';
import BaseLayout from '@/components/Layout/Base';
import styles from './page.module.css';
import type { FC, FormEvent } from 'react';

const Page: FC = () => {
  const { data: session } = useSession();
  if (session && session.user.role !== 0) notFound();

  const toast = useToast();
  const [user, setUser] = useState({
    firstName: '',
    lastName: '',
    email: '',
    role: 0,
  });

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (
      !user.firstName ||
      !user.lastName ||
      (typeof user.role !== 'number' && user.role <= 0)
    ) {
      toast({
        message: (
          <>
            Please fill in all fields
            {user.role < 0 ? (
              <>
                <br />
                Invalid role
              </>
            ) : null}
            {!user.firstName || !user.lastName ? (
              <>
                <br />
                Missing fields for user
              </>
            ) : null}
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
          role: 0,
        });
      }
    });
  };

  return (
    <BaseLayout
      title="Administration"
      description="Manage your school"
      sectionClassName={styles.formWrapper}
    >
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
          label="Role"
          onChange={v => setUser({ ...user, role: parseInt(v, 10) })}
          values={[
            { value: '0', label: 'Admin' },
            { value: '1', label: 'Teacher' },
          ]}
        />
        <Button type="submit">Ajouter</Button>
      </form>
    </BaseLayout>
  );
};

export default Page;
