'use client';
import * as DropdownMenuPrimitive from '@radix-ui/react-dropdown-menu';
import { AbsencePeriodCommentHideReason } from '@prisma/client';
import { EllipsisVerticalIcon, XIcon, ChevronDownIcon } from 'lucide-react';
import { useFormatter } from 'next-intl';
import { useState } from 'react';
import classNames from 'classnames';
import DropDownMenu from '@/components/Common/DropDownMenu';
import Select from '@/components/Common/Select';
import Button from '@/components/Common/Button';
import styles from './index.module.css';
import type { AbsencePeriodComment, User } from '@prisma/client';
import type { DateTimeFormatOptions } from 'next-intl';
import type { FC } from 'react';

type MessagesProps = {
  comments: Array<AbsencePeriodComment & { User: User }>;
};

const Messages: FC<MessagesProps> = ({ comments }) => {
  const [isHiding, setIsHiding] = useState<boolean>(false);
  const [selectedComment, setSelectedComment] = useState<number | null>(null);
  const [expendHidden, setExpendHidden] = useState<Array<number> | never>([]);
  const [reason, setReason] = useState('');
  const f = useFormatter();

  const Options: DateTimeFormatOptions = {
    dateStyle: 'medium',
    timeStyle: 'short',
  };

  const handleHideComment = async (id: number) => {
    if (!reason) return;

    await fetch('/api/absence-period/comment', {
      method: 'PATCH',
      body: JSON.stringify({
        actionType: 'hide',
        id,
        hideReason: reason,
      }),
    }).then(res => {
      if (res.ok) {
        setIsHiding(false);
      }
    });
  };

  const handleDeleteComment = async (id: number) => {
    const ok = confirm('Are you sure you want to delete this comment?');
    if (ok) {
      await fetch('/api/absence-period/comment', {
        method: 'DELETE',
        body: JSON.stringify({
          id,
        }),
      }).then(res => {
        if (res.ok) {
          setSelectedComment(null);
        }
      });
    } else {
      setSelectedComment(null);
    }
  };

  return (
    <>
      <h2 className={styles.title}>Comments</h2>
      {comments.length > 0 ? (
        <ul className={styles.list}>
          {comments.map(
            comment =>
              (comment.enabled && !comment.hidden && (
                <DropdownMenuPrimitive.Root key={comment.id}>
                  <li className={styles.item}>
                    <DropdownMenuPrimitive.Trigger className={styles.trigger}>
                      <EllipsisVerticalIcon />
                    </DropdownMenuPrimitive.Trigger>
                    <p className={styles.meta}>
                      {comment.User.firstName} {comment.User.lastName} -{' '}
                      {f.dateTime(new Date(comment.createdAt), Options)}
                    </p>
                    {isHiding && selectedComment === comment.id && (
                      <div className={styles.hide}>
                        <p>
                          Are you sure you want to hide this comment? Plese
                          choose a reason.
                        </p>
                        <span className={styles.hideActions}>
                          <Select
                            label="Reason"
                            values={[
                              {
                                value: AbsencePeriodCommentHideReason.DUPLICATE,
                                label: 'Duplicate',
                              },
                              {
                                value: AbsencePeriodCommentHideReason.OFF_TOPIC,
                                label: 'Off topic',
                              },
                              {
                                value: AbsencePeriodCommentHideReason.SPAM,
                                label: 'Spam',
                              },
                            ]}
                            onChange={v => setReason(v)}
                          />
                          <Button onClick={() => handleHideComment(comment.id)}>
                            Hide
                          </Button>
                        </span>
                        <XIcon
                          className={styles.closeIcon}
                          onClick={() => {
                            setIsHiding(false);
                            setSelectedComment(null);
                          }}
                        />
                      </div>
                    )}
                    <p>{comment.comment}</p>
                  </li>
                  <DropDownMenu className={styles.menu} withPortal>
                    <DropdownMenuPrimitive.Item
                      onClick={() => {
                        setIsHiding(true);
                        setSelectedComment(comment.id);
                      }}
                    >
                      Hide
                    </DropdownMenuPrimitive.Item>
                    <DropdownMenuPrimitive.Item
                      className={styles.delete}
                      onClick={() => {
                        handleDeleteComment(comment.id);
                        setSelectedComment(comment.id);
                      }}
                    >
                      Delete
                    </DropdownMenuPrimitive.Item>
                  </DropDownMenu>
                </DropdownMenuPrimitive.Root>
              )) ||
              (!comment.enabled && (
                <li className={styles.item}>
                  <p className={styles.meta}>
                    {comment.User.firstName} {comment.User.lastName} -{' '}
                    {f.dateTime(new Date(comment.createdAt), Options)}
                  </p>
                  <p className={styles.deleted}>
                    This comment has been deleted.
                  </p>
                </li>
              )) ||
              (comment.hidden && (
                <li className={styles.item}>
                  <p className={styles.meta}>
                    {comment.User.firstName} {comment.User.lastName} -{' '}
                    {f.dateTime(new Date(comment.createdAt), Options)}
                    <span className={styles.hidden}>
                      This comment has been hidden - for {comment.hideReason}{' '}
                      reason.
                    </span>
                  </p>
                  <button
                    onClick={() => {
                      if (expendHidden.includes(comment.id)) {
                        setExpendHidden(
                          expendHidden.filter(id => id !== comment.id)
                        );
                      } else {
                        setExpendHidden([...expendHidden, comment.id]);
                      }
                    }}
                    className={classNames(
                      'absolute right-2 top-2 transition-all duration-300',
                      {
                        'rotate-180 transform': expendHidden.includes(
                          comment.id
                        ),
                      }
                    )}
                  >
                    <ChevronDownIcon />
                  </button>
                  <p
                    className={classNames('transition-all duration-300', {
                      hidden: !expendHidden.includes(comment.id),
                    })}
                  >
                    {expendHidden.includes(comment.id) && comment.comment}
                  </p>
                </li>
              ))
          )}
        </ul>
      ) : (
        <p className={styles.noItems}>No comments yet.</p>
      )}
    </>
  );
};

export default Messages;
