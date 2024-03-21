import { ReactNode } from 'react';
import { PropsWithChildren } from 'react';

export function ToastPanel(
  props: PropsWithChildren<{
    className?: string;
    image: string;
    title: string;
    content: ReactNode;
  }>,
): ReactNode {
  const { className = '', image, title, content } = props;
  return (
    <div className={`flex align-center justify-between gap12 ${className}`}>
      <div className={'flex col'}>
        <p className={'bold toast-title'}>{title}</p>
        <p className={'small toast-text'}>{content}</p>
      </div>
      <img width={24} height={24} src={image} alt={title} />
    </div>
  );
}
