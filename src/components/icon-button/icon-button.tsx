import React, { memo } from 'react';

import Link, { LinkProps } from '../link/link';

function IconButtonBase(props: { body?: string; image: string }) {
  return (
    <div
      className={`${'icon-button-container'} ${
        props.body ? 'icon-button-large' : 'icon-button-small'
      }`}
    >
      <div className={'icon-button-body'}>
        <div className={'icon-button-icon'}>
          <img
            src={props.image}
            alt={''}
            width={props.body ? 16 : 24}
            height={props.body ? 16 : 24}
          />
        </div>
        <p className={'icon-button-text'}>{props.body}</p>
      </div>
    </div>
  );
}

export default memo(function IconButton(props: {
  body?: string;
  image: string;
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
