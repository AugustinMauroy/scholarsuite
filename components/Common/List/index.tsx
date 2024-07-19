'use client';
import { XMarkIcon, PlusIcon } from '@heroicons/react/24/solid';
import { useState, useEffect, useMemo } from 'react';
import TagList from '@/components/Common/TagList';
import type { FC } from 'react';
import type { Tag } from '@/types/tag';

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
    <div className="relative flex items-center justify-start border-2 border-gray-200 py-2">
      <TagList
        tags={activeList}
        onClick={onTagRemove}
        className="w-1/2"
        icon={<XMarkIcon />}
      />
      <input
        className="w-1/2 border-l-2 border-gray-200 p-2 caret-brand-500 focus:outline-none"
        type="text"
        placeholder="Search"
        value={searchQuery}
        onChange={e => setSearchQuery(e.target.value)}
        onFocus={() => setFocus(true)}
        onBlur={() => {
          // 1s delay to prevent search result from disappearing when clicked
          setTimeout(() => setFocus(false), 1000);
        }}
      />
      {searchResult.length > 0 && focus && (
        <div className="absolute right-0 top-full my-2 w-1/2 border-2 border-gray-200 bg-white py-2">
          <TagList
            tags={searchResult}
            onClick={onTagClick}
            icon={<PlusIcon />}
          />
        </div>
      )}
    </div>
  );
};

export default List;
