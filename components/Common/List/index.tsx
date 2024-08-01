'use client';
import { XMarkIcon, PlusIcon } from '@heroicons/react/24/solid';
import { useState, useEffect, useMemo } from 'react';
import TagList from '@/components/Common/TagList';
import Input from '../Input';
import styles from './index.module.css';
import type { Tag } from '@/types/tag';
import type { FC } from 'react';

type ListProps = {
  list: Tag[];
  activeList: Tag[];
  /** when a tag is clicked on search result*/
  onTagClick: (tag: Tag) => void;
  /** when a tag is clicked on active list*/
  onTagRemove: (tag: Tag) => void;
};

const List: FC<ListProps> = ({ list, activeList, onTagClick, onTagRemove }) => {
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [searchResult, setSearchResult] = useState<Tag[]>([]);
  const [focus, setFocus] = useState<boolean>(false);

  const searchList = useMemo(() => {
    return list.filter(tag =>
      activeList?.every(activeTag => activeTag.id !== tag.id)
    );
  }, [list, activeList]);

  useEffect(() => {
    if (!searchQuery) {
      setSearchResult([]);

      return;
    }

    const result = searchList.filter(tag =>
      tag.name.toLowerCase().includes(searchQuery.toLowerCase())
    );

    setSearchResult(result);
  }, [searchQuery]);

  return (
    <div className={styles.list}>
      <TagList
        tags={activeList}
        onClick={onTagRemove}
        className={styles.activeList}
        icon={<XMarkIcon />}
      />
      <input
        className={styles.input}
        type="text"
        placeholder="Search"
        value={searchQuery}
        onChange={e => setSearchQuery(e.target.value)}
        onFocus={() => setFocus(true)}
        onBlur={() =>
          // 1s delay to prevent search result from disappearing when clicked
          setTimeout(() => setFocus(false), 1000)
        }
      />
      {searchResult.length > 0 && focus && (
        <div className={styles.result}>
          <TagList
            tags={searchResult}
            onClick={(tag: Tag) => {
              onTagClick(tag);
              setSearchQuery('');
              setFocus(false);
            }}
            icon={<PlusIcon />}
          />
        </div>
      )}
    </div>
  );
};

export default List;
