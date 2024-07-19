'use client';
import * as DialogPrimitive from '@radix-ui/react-dialog';
import { useState, useEffect } from 'react';
import {
  PencilIcon,
  XMarkIcon,
  CheckCircleIcon,
  ExclamationTriangleIcon,
} from '@heroicons/react/24/solid';
import { useSession } from 'next-auth/react';
import Button from '@/components/Common/Button';
import Input from '@/components/Common/Input';
import Select from '@/components/Common/Select';
import { useToast } from '@/hooks/useToast';
import List from '@/components/Common/List';
import styles from './index.module.css';
import type { FC } from 'react';
import type { User, Class } from '@prisma/client';
import type { Patch } from '@/types/patch';
import type { Tag } from '@/types/tag';

const UsersTable: FC = () => {
  const toast = useToast();
  const { data: session } = useSession();
  const [userList, setUserList] = useState<User[]>([]);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [classes, setClasses] = useState<Class[]>([]);
  const [activeList, setActiveList] = useState<Class[]>([]);
  const [userClassesPatch, setUserClassesPatch] = useState<Patch | null>(null);

  useEffect(() => {
    fetch('/api/user')
      .then(response => response.json())
      .then(data => setUserList(data.data));
    fetch('/api/class')
      .then(res => res.json())
      .then(data => setClasses(data.data));
  }, []);

  useEffect(() => {
    if (!selectedUser) return;

    fetch('/api/class', {
      method: 'POST',
      body: JSON.stringify({ userId: selectedUser.id }),
    })
      .then(res => res.json())
      .then(data => setActiveList(data.data));
  }, [selectedUser]);

  const handlePatch = async () => {
    if (!userClassesPatch || userClassesPatch.data.length === 0) return;

    console.log(userClassesPatch);

    fetch('/api/user/class', {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(userClassesPatch),
    })
      .then(res => res.json())
      .then(data => {
        if (data.error) {
          toast({
            message: data.error,
            kind: 'error',
          });

          return;
        }

        setUserClassesPatch(null);

        toast({
          message: (
            <>
              <CheckCircleIcon />
              Classes updated successfully
            </>
          ),
          kind: 'success',
        });
      });
  };

  const handleEdit = async () => {
    if (!selectedUser) return;
    if (selectedUser.firstName === '' || selectedUser.lastName === '') {
      toast({
        message: (
          <>
            <ExclamationTriangleIcon />
            Please fill in all fields
          </>
        ),
        kind: 'error',
      });

      return;
    }

    const response = await fetch(`/api/user/${selectedUser.id}`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(selectedUser),
    });

    response.json().then(data => {
      if (data.error) {
        toast({
          message: (
            <>
              <ExclamationTriangleIcon />
              {data.error}
            </>
          ),
          kind: 'error',
        });
        setSelectedUser(null);

        return;
      }

      const user = data.data as User;
      setSelectedUser(null);
      setUserList(userList.map(u => (u.id === user.id ? user : u)));
      toast({
        message: (
          <>
            <CheckCircleIcon />
            User updated successfully
          </>
        ),
        kind: 'success',
      });
    });

    await handlePatch();
  };

  /**
   * When clicking on a tag, add it to the active list
   * Also, add it to the patch object
   */
  const handleTagClick = (tag: Tag) => {
    if (!selectedUser) return;

    setActiveList([...activeList, classes.find(Class => Class.id === tag.id)!]);

    if (!userClassesPatch) {
      setUserClassesPatch({
        userId: selectedUser.id,
        data: [{ opp: 'add', id: tag.id }],
      });
    } else {
      setUserClassesPatch({
        userId: selectedUser.id,
        data: [...userClassesPatch.data, { opp: 'add', id: tag.id }],
      });
    }
  };

  const handleTagRemove = (tag: Tag) => {
    if (!selectedUser) return;
    const userId = selectedUser.id;

    const newClasses = activeList.filter(Class => Class.id !== tag.id);

    setActiveList(newClasses);

    if (!userClassesPatch) {
      setUserClassesPatch({
        userId,
        data: [{ opp: 'remove', id: tag.id }],
      });

      return;
    } else {
      setUserClassesPatch({
        userId,
        data: [...userClassesPatch.data, { opp: 'remove', id: tag.id }],
      });
    }
  };

  return (
    <DialogPrimitive.Root>
      <table>
        <thead>
          <tr>
            <th>First Name</th>
            <th>Last Name</th>
            <th>Email</th>
            <th>Role</th>
            <th>Enabled</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {userList.map(user => (
            <tr key={user.id}>
              <td>{user.firstName}</td>
              <td>{user.lastName}</td>
              <td>{user.email}</td>
              <td>{user.role}</td>
              <td>
                <Input type="checkbox" checked={user.enabled} disabled />
              </td>
              <td>
                <DialogPrimitive.Trigger asChild>
                  <Button onClick={() => setSelectedUser(user)}>
                    <PencilIcon />
                    Edit
                  </Button>
                </DialogPrimitive.Trigger>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      <DialogPrimitive.Portal>
        <DialogPrimitive.Overlay className={styles.modalOverlay} />
        <DialogPrimitive.Content className={styles.modalContent}>
          <DialogPrimitive.Close asChild>
            <XMarkIcon
              className={styles.closeIcon}
              onClick={() => setSelectedUser(null)}
            />
          </DialogPrimitive.Close>
          {selectedUser ? (
            <>
              <DialogPrimitive.Title>User Class</DialogPrimitive.Title>
              <DialogPrimitive.Description>
                Update the user&apos;s information
              </DialogPrimitive.Description>
              <Input
                label="First Name"
                value={selectedUser.firstName}
                onChange={e =>
                  setSelectedUser({
                    ...selectedUser,
                    firstName: e.target.value,
                  })
                }
              />
              <Input
                label="Last Name"
                value={selectedUser?.lastName}
                onChange={e =>
                  setSelectedUser({ ...selectedUser, lastName: e.target.value })
                }
              />
              <Input
                label="Email"
                value={selectedUser?.email ?? ''}
                onChange={e =>
                  setSelectedUser({ ...selectedUser, email: e.target.value })
                }
              />
              <Select
                label="Role"
                values={[
                  { value: 'ADMIN', label: 'Admin' },
                  { value: 'TEACHER', label: 'Teacher' },
                  { value: 'STUDENT', label: 'Student' },
                ]}
                defaultValue={selectedUser.role.toString()}
                onChange={v =>
                  setSelectedUser({
                    ...selectedUser,
                    role: v as User['role'],
                  })
                }
              />
              <List
                list={classes}
                activeList={activeList}
                onTagClick={handleTagClick}
                onTagRemove={handleTagRemove}
              />
              {session?.user.id !== selectedUser.id && (
                <Input
                  label="Enabled"
                  type="checkbox"
                  checked={selectedUser.enabled}
                  onChange={e =>
                    setSelectedUser({
                      ...selectedUser,
                      enabled: e.target.checked,
                    })
                  }
                />
              )}
              <DialogPrimitive.Close asChild>
                <Button kind="outline" onClick={handleEdit}>
                  Save
                </Button>
              </DialogPrimitive.Close>
            </>
          ) : (
            <>
              <DialogPrimitive.Title>Error</DialogPrimitive.Title>
              <DialogPrimitive.Description>
                User not found
              </DialogPrimitive.Description>
            </>
          )}
        </DialogPrimitive.Content>
      </DialogPrimitive.Portal>
    </DialogPrimitive.Root>
  );
};

export default UsersTable;
