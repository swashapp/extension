import React, { memo } from 'react';

import Link, { LinkProps } from '../link/link';

function IconButtonBase(props: {
  body?: string;
  image: string;
  imageSize?: { width?: number; height?: number };
}) {
  return (
    <div
      className={`${'icon-button-container'} ${
        props.body ? 'icon-button-large' : 'icon-button-small'
      }`}
    >
      <div className={'icon-button-body'}>
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

export default memo(function IconButton(props: {
  body?: string;
  image: string;
  imageSize?: { width?: number; height?: number };
  link: LinkProps | false;
}) {
  return props.link === false ? (
    <IconButtonBase {...props} />
  ) : (
    <Link {...props.link}>
      <IconButtonBase {...props} />
    </Link>
  );
});
