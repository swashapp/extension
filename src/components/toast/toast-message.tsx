import React, { memo, ReactElement } from 'react';
import { PropsWithChildren } from 'react';
// eslint-disable-next-line @typescript-eslint/ban-ts-comment
//@ts-ignore
import ErrorIcon from 'url:../../static/images/icons/error.png';
// eslint-disable-next-line @typescript-eslint/ban-ts-comment
//@ts-ignore
import SuccessIcon from 'url:../../static/images/icons/success.png';
// eslint-disable-next-line @typescript-eslint/ban-ts-comment
//@ts-ignore
import WarningIcon from 'url:../../static/images/icons/warning.png';

import ToastPanel from './toast-panel';

const Messages = {
  success: {
    title: 'Success!',
    icon: SuccessIcon,
    class: 'toast-message-success',
  },
  warning: {
    title: 'Warning!',
    icon: WarningIcon,
    class: 'toast-message-warning',
  },
  error: { title: 'Error!', icon: ErrorIcon, class: 'toast-message-error' },
};
export default memo(function ToastMessage(
  props: PropsWithChildren<{
    type: keyof typeof Messages;
    content: ReactElement;
  }>,
) {
  return (
    <ToastPanel
      className={Messages[props.type].class}
      title={Messages[props.type].title}
      content={props.content}
      image={Messages[props.type].icon}
    />
  );
});
