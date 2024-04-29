'use client';
// @todo:
// - [ ] use translation
// - [ ] handle errors such as missing fields ...
import * as AvatarPrimitive from '@radix-ui/react-avatar';
import { useState } from 'react';
import Input from '@/components/Common/Input';
import Button from '@/components/Common/Button';
import DropZone from '@/components/Common/DropZone';
import BaseLayout from '@/components/Layout/Base';
import styles from './page.module.css';
import type { FC, FormEvent } from 'react';

const Page: FC = () => {
  const [file, setFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [displayRemove, setDisplayRemove] = useState(false);

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!firstName || !lastName || !file) {
      return;
    }

    const formData = new FormData();
    formData.append('firstName', firstName);
    formData.append('lastName', lastName);
    formData.append('file', file);
    formData.append('email', email);

    try {
      const response = await fetch('/api/student', {
        method: 'PUT',
        body: formData,
      });

      if (response.ok) {
        setFirstName('');
        setLastName('');
        setEmail('');
        setFile(null);
        setImagePreview(null);
      } else {
        console.error('Failed to add student:', response.statusText);
      }
    } catch (error) {
      console.error('Error adding student:', error);
    }
  };

  return (
    <BaseLayout
      title="Administration"
      description="Manage your school"
      sectionClassName={styles.formWrapper}
    >
      <form onSubmit={handleSubmit}>
        {imagePreview ? (
          <AvatarPrimitive.Root
            className={styles.avatarRoot}
            onMouseEnter={() => setDisplayRemove(true)}
            onMouseLeave={() => setDisplayRemove(false)}
          >
            <AvatarPrimitive.Image
              src={imagePreview}
              alt="Photo de l’étudiant"
              className={styles.avatar}
            />
            <AvatarPrimitive.Fallback className={styles.avatar}>
              {`${firstName.charAt(0)}${lastName.charAt(0)}`}
            </AvatarPrimitive.Fallback>
            {displayRemove && (
              <button
                className={styles.avatarRemove}
                onClick={() => {
                  setFile(null);
                  setImagePreview(null);
                }}
              >
                Supprimer
              </button>
            )}
          </AvatarPrimitive.Root>
        ) : (
          <DropZone
            file={file}
            setFile={(file: File) => {
              setFile(file);
              setImagePreview(URL.createObjectURL(file));
            }}
            title="Photo de l’étudiant"
          />
        )}
        <Input
          label="Prénom"
          type="text"
          value={firstName}
          onChange={e => setFirstName(e.target.value)}
        />
        <Input
          label="Nom"
          type="text"
          value={lastName}
          onChange={e => setLastName(e.target.value)}
        />
        <Input
          label="Email"
          type="email"
          value={email}
          onChange={e => setEmail(e.target.value)}
        />
        <Button type="submit">Ajouter</Button>
      </form>
    </BaseLayout>
  );
};

export default Page;
