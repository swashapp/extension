import React from 'react';
import { memo } from 'react';
// eslint-disable-next-line @typescript-eslint/ban-ts-comment
//@ts-ignore
import logo from 'url:../../static/images/logos/swash-logo.svg';

import { WebsitePath } from '../../paths';
import Link from '../link/link';

export default memo(function SwashLogo(props: { className?: string }) {
  return (
    <Link url={WebsitePath} position={'Sidenav'} event={'SwashLogo'}>
      <img
        className={`swash-logo ${props.className}`}
        src={logo}
        alt={'Swash'}
      />
    </Link>
  );
});
