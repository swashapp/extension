import { ReactElement } from 'react';
import { PropsWithChildren } from 'react';

export function ToastPanel(
  props: PropsWithChildren<{
    className?: string;
    image: string;
    title: string;
    content: ReactElement;
  }>,
): ReactElement {
  return (
    <div className={`flex align-center ${props.className}`}>
      <div className={'toast-image'}>
        <img width={16} height={16} src={props.image} alt="" />
      </div>
      <div className={'flex col'}>
        <p className={'toast-title'}>{props.title}</p>
        <p className={'small toast-text'}>{props.content}</p>
      </div>
    </div>
  );
}
