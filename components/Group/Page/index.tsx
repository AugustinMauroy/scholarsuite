'use client';
import Link from 'next/link';
import { useState, useEffect, useRef } from 'react';
import BaseLayout from '@/components/Layout/Base';
import Card from '@/components/Common/Card';
import Badge from '@/components/Common/Badge';
import Input from '@/components/Common/Input';
import { useCommand } from '@/hooks/useCommand';
import styles from './index.module.css';
import type { Group, Subject } from '@prisma/client';
import type { FC } from 'react';

type GroupPageProps = {
  groups: (Group & { Subject: Subject })[];
};

const GroupPage: FC<GroupPageProps> = ({ groups }) => {
  const ref = useRef<HTMLInputElement>(null);
  const [data, setData] = useState(groups);
  const [search, setSearch] = useState('');

  useEffect(() => {
    setData(
      groups.filter(
        group =>
          group?.name?.toLowerCase().includes(search.toLowerCase()) ||
          group.ref.toLowerCase().includes(search.toLowerCase())
      )
    );
  }, [search, groups]);

  useCommand('k', () => ref?.current?.focus());

  return (
    <BaseLayout
      title="Attendance Groups"
      sectionClassName={styles.section}
      actions={
        <Input
          ref={ref}
          placeholder="🔎 Search for a group"
          type="text"
          className="mb-1.5"
          aria-label="Search for a group"
          value={search}
          onChange={e => setSearch(e.target.value)}
        />
      }
    >
      {data.map(group => (
        <Link
          href={`/group-attendance/${group.id}`}
          key={group.id}
          aria-label={`View ${group.name}`}
        >
          <Card className={styles.card}>
            <h2>{group.name}</h2>
            <span className={styles.meta}>
              <p>{group.Subject.name}</p>
              <Badge>{group.ref}</Badge>
            </span>
          </Card>
        </Link>
      ))}
    </BaseLayout>
  );
};

export default GroupPage;
