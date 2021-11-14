import React from 'react';

import { WebsitePath } from '../../paths';
import { Link } from '../link/link';

const logo = '/static/images/logos/swash-logo.png';

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
