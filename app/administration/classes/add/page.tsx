'use client';
import { useState, useEffect } from 'react';
import Select from '@/components/Common/Select';
import Input from '@/components/Common/Input';
import Button from '@/components/Common/Button';
import styles from './page.module.css';
import type { FC, FormEvent } from 'react';
import type { SchoolLevel } from '@prisma/client';

const Page: FC = () => {
  const [schoolLevel, setSchoolLevel] = useState<SchoolLevel[] | null>(null);
  const [name, setName] = useState('');
  const [selectedSchoolLevel, setSelectedSchoolLevel] = useState<number | null>(
    null
  );

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (selectedSchoolLevel === null || name === '') return;

    const resp = await fetch('/api/class', {
      method: 'PUT',
      body: JSON.stringify({
        name,
        schoolLevelId: selectedSchoolLevel,
      }),
      headers: {
        'Content-Type': 'application/json',
      },
    });

    if (resp.ok) {
      setName('');
      setSelectedSchoolLevel(null);
    }
  };

  useEffect(() => {
    fetch('/api/schoolLevel')
      .then(res => res.json())
      .then(data => {
        setSchoolLevel(data.data);
      })
      .catch(err => {
        console.error(err);
      });
  }, []);

  return (
    <main className={styles.page}>
      <header>
        <h1>Administration</h1>
        <p>Ajout d&apos;une Classe</p>
      </header>
      <section className={styles.formWrapper}>
        <form onSubmit={handleSubmit}>
          <Input
            label="Nom"
            type="text"
            value={name}
            onChange={e => setName(e.target.value)}
          />
          {schoolLevel === null ? (
            <p>Loading...</p>
          ) : (
            <Select
              label="Niveau Scolaire"
              values={schoolLevel.map(level => ({
                label: level.name,
                value: level.id.toString(),
              }))}
              onChange={e => setSelectedSchoolLevel(parseInt(e, 10))}
            />
          )}
          <Button type="submit">Ajouter</Button>
        </form>
      </section>
    </main>
  );
};

export default Page;
