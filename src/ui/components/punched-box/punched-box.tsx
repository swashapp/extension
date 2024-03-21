import { PropsWithChildren, ReactNode } from 'react';

import '../../../static/css/components/punched-box.css';

export function PunchedBox(
  props: PropsWithChildren<{ className: string }>,
): ReactNode {
  const { className } = props;

  return <div className={`punched-box ${className}`}>{props.children}</div>;
}
