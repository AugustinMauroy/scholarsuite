'use client';
import { useState } from 'react';
import Button from '@/components/Common/Button';
import Input from '@/components/Common/Input';
import BaseLayout from '@/components/Layout/Base';
import { useToast } from '@/hooks/useToast';
import styles from './page.module.css';
import type { FC, FormEvent } from 'react';

const Page: FC = () => {
  const toast = useToast();
  const [name, setName] = useState('');

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!name) {
      toast({
        message: 'Name is required',
        kind: 'error',
      });

      return;
    }

    const response = await fetch('/api/schoolLevel', {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        name,
      }),
    });

    await response.json().then(data => {
      if (data.error) {
        toast({
          message: data.error,
          kind: 'error',
        });
      } else {
        toast({
          message: 'School level added',
          kind: 'success',
        });

        setName('');
      }
    });
  };

  return (
    <BaseLayout sectionClassName={styles.formWrapper}>
      <form onSubmit={handleSubmit}>
        <Input
          type="text"
          name="name"
          label="Name"
          required
          value={name}
          onChange={e => setName(e.target.value)}
        />
        <Button type="submit">Add</Button>
      </form>
    </BaseLayout>
  );
};

export default Page;
