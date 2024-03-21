import { PropsWithChildren, ReactNode, useState } from 'react';

import { CloseIcon } from '../svg/close';

export function ClosablePanel(
  props: PropsWithChildren<{
    className?: string;
    onClose?: () => void;
    children: ReactNode;
  }>,
): ReactNode {
  const [hide, setHide] = useState<boolean>(false);
  const [close, setClose] = useState<boolean>(false);
  return (
    <div
      className={`relative ${
        close ? 'closable-panel-close' : 'closable-panel-open'
      } ${hide ? 'hide' : ''} ${props.className}`}
    >
      <div
        onClick={() => {
          props.onClose && props.onClose();
          setClose(true);
          setTimeout(() => {
            setHide(true);
          }, 1000);
        }}
        className={'absolute closable-panel-icon'}
      >
        <CloseIcon />
      </div>
      {props.children}
    </div>
  );
}
