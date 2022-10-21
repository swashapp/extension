import React, { PropsWithChildren, ReactElement, useState } from 'react';

const CloseIcon = '/static/images/shape/close.svg';

export function ClosablePanel(
  props: PropsWithChildren<{
    className?: string;
    onClose?: () => void;
    children: ReactElement;
  }>,
): JSX.Element {
  const [hide, setHide] = useState<boolean>(false);
  const [close, setClose] = useState<boolean>(false);
  return (
    <div
      className={`closable-panel-container ${
        close ? 'closable-panel-close' : 'closable-panel-open'
      } ${hide ? 'closable-panel-hide' : ''} ${props.className}`}
    >
      <div
        onClick={() => {
          props.onClose && props.onClose();
          setClose(true);
          setTimeout(() => {
            setHide(true);
          }, 1000);
        }}
        className="closable-panel-icon"
      >
        <img width={24} height={24} src={CloseIcon} alt={'x'} />
      </div>
      {props.children}
    </div>
  );
}
