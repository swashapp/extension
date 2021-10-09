import React, { ReactElement } from 'react';
import { PropsWithChildren } from 'react';
import ToastPanel from './toast-panel';
import SuccessIcon from 'url:../../static/images/icons/success.png';
import ErrorIcon from 'url:../../static/images/icons/error.png';
import WarningIcon from 'url:../../static/images/icons/warning.png';

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
export default function ToastMessage(
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
}
