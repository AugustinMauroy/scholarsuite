'use client';
// @todo:
// - [ ] use translation
import * as AvatarPrimitive from '@radix-ui/react-avatar';
import { notFound } from 'next/navigation';
import { useSession } from 'next-auth/react';
import { useState } from 'react';
import { useToast } from '@/hooks/useToast';
import Input from '@/components/Common/Input';
import Button from '@/components/Common/Button';
import DropZone from '@/components/Common/DropZone';
import BaseLayout from '@/components/Layout/Base';
import styles from './page.module.css';
import type { FC, FormEvent } from 'react';

const Page: FC = () => {
  const { data: session } = useSession();
  if (session && session.user.role !== 'ADMIN') notFound();

  const toast = useToast();
  const [file, setFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [displayRemove, setDisplayRemove] = useState(false);

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!firstName || !lastName) {
      toast({
        message: 'Veuillez renseigner le prénom et le nom de l’étudiant',
        kind: 'error',
      });

      return;
    }

    const formData = new FormData();
    formData.append('firstName', firstName);
    formData.append('lastName', lastName);
    file && formData.append('file', file);
    formData.append('email', email);

    try {
      const response = await fetch('/api/student', {
        method: 'PUT',
        body: formData,
      });
      if (response.ok) {
        toast({
          message: 'Étudiant ajouté avec succès',
          kind: 'success',
        });
        setFirstName('');
        setLastName('');
        setEmail('');
        setFile(null);
        setImagePreview(null);
      } else {
        toast({
          message: 'Une erreur est survenue',
          kind: 'error',
        });
      }
    } catch (error) {
      console.error('Error adding student:', error);
    }
  };

  return (
    <BaseLayout sectionClassName={styles.formWrapper}>
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
