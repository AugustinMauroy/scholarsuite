//@ts-nocheck
import type { FC } from 'react';
import type { Class, SchoolLevel } from '@prisma/client';

const ClassNav: FC = ({ items }) => {
  return (
    <nav>
      {items.map(item => (
        <>
          <h2>{item.schoolLevel.name}</h2>
          <ul>
            {item.map(classItem => (
              <li key={classItem.id}>
                <a href={`/class/${classItem.id}`}>{classItem.name}</a>
              </li>
            ))}
          </ul>
        </>
      ))}
    </nav>
  );
};

export default ClassNav;
