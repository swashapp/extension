import { PropsWithChildren } from 'react';

import styles from './icon.module.css';

export function Icon(props: PropsWithChildren<{ className: string }>) {
  return (
    <span className={`flex center ${styles.container} ${props.className}`}>
      {props.children}
    </span>
  );
}
