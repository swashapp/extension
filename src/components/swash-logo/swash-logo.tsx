import React from 'react';
import { memo } from 'react';

import Link from '../link/link';
import { WebsitePath } from '../../paths';

import logo from 'url:../../static/images/logos/swash-logo.svg';

export default memo(function SwashLogo() {
  return (
    <Link url={WebsitePath} position={'Sidenav'} event={'SwashLogo'}>
      <img className="swash-logo" src={logo} alt={'Swash'} />
    </Link>
  );
});
