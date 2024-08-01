import classNames from 'classnames';
import Badge from '@/components/Common/Badge';
import styles from './index.module.css';
import type { Tag } from '@/types/tag';
import type { FC, ReactNode } from 'react';

type TagListProps = {
  tags: Tag[];
  icon?: ReactNode;
  onClick: (tag: Tag) => void;
  className?: string;
};

const TagList: FC<TagListProps> = ({ tags, onClick, className, icon }) => (
  <div className={classNames(styles.tagList, className)}>
    {tags?.map(tag => (
      <Badge key={tag.id} onClick={() => onClick(tag)}>
        {tag.name}
        {icon}
      </Badge>
    ))}
  </div>
);

export default TagList;
