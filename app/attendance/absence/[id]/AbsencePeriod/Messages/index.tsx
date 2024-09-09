'use client';
import { useFormatter } from 'next-intl';
import styles from './index.module.css';
import type { AbsencePeriodComment, User } from '@prisma/client';
import type { DateTimeFormatOptions } from 'next-intl';
import type { FC } from 'react';

type MessagesProps = {
  comments: Array<AbsencePeriodComment & { User: User }>;
};

const Messages: FC<MessagesProps> = ({ comments }) => {
  const f = useFormatter();

  const Options: DateTimeFormatOptions = {
    dateStyle: 'medium',
    timeStyle: 'short',
  };

  return (
    <>
      <h2 className={styles.title}>Comments</h2>
      {comments.length > 0 ? (
        <ul className={styles.list}>
          {comments.map(comment => (
            <li key={comment.id} className={styles.item}>
              {/*
                  dropDownMenu will be here
                  - Edit
                  - Delete
                  - hide
                */}
              <p className={styles.meta}>
                {comment.User.firstName} {comment.User.lastName} -{' '}
                {f.dateTime(new Date(comment.createdAt), Options)}
              </p>
              <p>{comment.comment}</p>
            </li>
          ))}
        </ul>
      ) : (
        <p className={styles.noItems}>No comments yet.</p>
      )}
    </>
  );
};

export default Messages;
