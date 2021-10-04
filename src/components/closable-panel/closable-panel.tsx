import React, { PropsWithChildren, useState } from 'react';
import CloseIcon from 'url:../../static/images/shape/close.svg';

export default function ClosablePanel(
  props: PropsWithChildren<{ className?: string; onClose?: () => void }>,
) {
  const [close, setClose] = useState<boolean>(false);
  return (
    <div
      className={`closable-panel-container ${
        close ? 'closable-panel-close' : 'closable-panel-open'
      } ${props.className}`}
    >
      <div
        onClick={() => {
          props.onClose && props.onClose();
          setClose(true);
        }}
        className="closable-panel-icon"
      >
        <img width={24} height={24} src={CloseIcon} alt={'x'} />
      </div>
      {props.children}
    </div>
  );
}
