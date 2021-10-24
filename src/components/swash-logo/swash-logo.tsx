import React from 'react';

// eslint-disable-next-line @typescript-eslint/ban-ts-comment
//@ts-ignore
import logo from 'url:../../static/images/logos/swash-logo.svg';

import { WebsitePath } from '../../paths';
import { Link } from '../link/link';

export function SwashLogo(props: { className?: string }): JSX.Element {
  return (
    <Link url={WebsitePath} external>
      <img
        className={`swash-logo ${props.className}`}
        src={logo}
        alt={'Swash'}
      />
    </Link>
  );
}
