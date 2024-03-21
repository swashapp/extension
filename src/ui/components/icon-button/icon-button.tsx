import { ReactNode } from 'react';

import { Link, LinkProps } from '../link/link';

import '../../../static/css/components/icon-button.css';

function IconButtonBase(props: {
  body?: string;
  image: string;
  imageSize?: { width?: number; height?: number };
  onClick?: () => void;
}) {
  return (
    <div
      onClick={props.onClick}
      className={`flex center icon-button-container ${
        props.body ? 'icon-button-large' : 'icon-button-small'
      }`}
    >
      <div className={'flex align-center'}>
        <img
          src={props.image}
          alt={''}
          width={props.imageSize ? props.imageSize.width || 24 : 24}
          height={props.imageSize ? props.imageSize.height || 24 : 24}
        />
        {props.body ? <p className={'icon-button-text'}>{props.body}</p> : null}
      </div>
    </div>
  );
}

export function IconButton(props: {
  body?: string;
  image: string;
  imageSize?: { width?: number; height?: number };
  link?: LinkProps;
  onClick?: () => void;
}): ReactNode {
  return !props.link ? (
    <IconButtonBase {...props} />
  ) : (
    <Link {...props.link}>
      <IconButtonBase {...props} />
    </Link>
  );
}
