import React, { ReactElement } from 'react';

import { Link, LinkProps } from '../link/link';

import '../../static/css/components/icon-button.css';

function IconButtonBase(props: {
  body?: string;
  image: string;
  imageSize?: { width?: number; height?: number };
  onClick?: () => void;
  disabled?: boolean;
}) {
  return (
    <div
      onClick={props.onClick}
      className={`flex center icon-button-container ${
        props.disabled ? 'disabled' : ''
      } ${props.body ? 'icon-button-large' : 'icon-button-small'}`}
    >
      <div className={'flex align-center'}>
        <img
          src={props.image}
          alt={''}
          width={props.imageSize ? props.imageSize.width || 24 : 24}
          height={props.imageSize ? props.imageSize.height || 24 : 24}
        />
        {props.body ? (
          <p className={'icon-button-text'}>{props.body}</p>
        ) : (
          <></>
        )}
      </div>
    </div>
  );
}

export function IconButton(props: {
  body?: string;
  image: string;
  imageSize?: { width?: number; height?: number };
  link: LinkProps | false;
  onClick?: () => void;
  disabled?: boolean;
}): ReactElement {
  return props.link === false ? (
    <IconButtonBase {...props} />
  ) : (
    <Link {...props.link}>
      <IconButtonBase {...props} />
    </Link>
  );
}
