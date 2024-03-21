import { ReactNode } from 'react';
import { toast } from 'react-toastify';

import { ToastPanel } from './toast-panel';

const Messages = {
  success: {
    title: 'Success!',
    icon: '/static/images/icons/toast/success.svg',
    class: 'toast-message success',
  },
  error: {
    title: 'Error!',
    icon: '/static/images/icons/toast/error.svg',
    class: 'toast-message error',
  },
};

export function toastMessage(
  type: keyof typeof Messages,
  content: ReactNode | string,
) {
  return toast(
    <ToastPanel
      className={Messages[type].class}
      title={Messages[type].title}
      content={typeof content === 'string' ? <>{content}</> : content}
      image={Messages[type].icon}
    />,
  );
}
