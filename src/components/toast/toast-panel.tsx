import React, { memo, ReactElement } from 'react';
import { PropsWithChildren } from 'react';

export default memo(function ToastPanel(
  props: PropsWithChildren<{
    className?: string;
    image: string;
    title: string;
    content: ReactElement;
  }>,
) {
  return (
    <div className={`flex-row toast-panel ${props.className}`}>
      <div className="toast-image">
        <img width={16} height={16} src={props.image} alt="" />
      </div>
      <div className="flex-column">
        <div className="toast-title title">{props.title}</div>
        <div className="toast-text">{props.content}</div>
      </div>
    </div>
  );
});
