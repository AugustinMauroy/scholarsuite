import { ChevronDownIcon } from '@heroicons/react/24/outline';
import classNames from 'classnames';
import { motion } from 'framer-motion';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useState } from 'react';
import styles from './index.module.css';
import type { NavItem } from '../Container';
import type { FC } from 'react';

type AccordionMenuProps = {
  items: NavItem[];
};

const AccordionMenu: FC<AccordionMenuProps> = ({ items }) => {
  const pathname = usePathname();
  const [openIndex, setOpenIndex] = useState([-1]);

  return (
    <div className={styles.accordionMenu}>
      {items.map((item, index) => (
        <div key={item.label} className={styles.item}>
          <button
            className={styles.accordion}
            onClick={() => {
              // if open close it
              // if closed open it and add it to the openIndex
              setOpenIndex(prev =>
                prev.includes(index)
                  ? prev.filter(i => i !== index)
                  : [...prev, index]
              );
            }}
          >
            <span>{item.label}</span>
            <ChevronDownIcon
              className={classNames(openIndex.includes(index) && styles.close)}
            />
          </button>
          {openIndex.includes(index) && (
            <motion.div
              className={styles.panel}
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.2 }}
            >
              {item.children.map(child => (
                <Link
                  key={child.href}
                  href={child.href}
                  className={classNames(
                    pathname.includes(child.href) && styles.active
                  )}
                >
                  {child.label}
                </Link>
              ))}
            </motion.div>
          )}
        </div>
      ))}
    </div>
  );
};

export default AccordionMenu;
