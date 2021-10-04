import React, { memo } from 'react';

import SwashLogo from '../swash-logo/swash-logo';

import SidenavLinks from './sidenav-links';
import WelcomeToNewDataWorld from './welcome-to-new-data-world';

export default memo(function Sidenav() {
  return (
    <div className={'sidenav-container'}>
      <div>
        <div className={'sidenav-logo'}>
          <SwashLogo />
        </div>
        <div className={'sidenav-links-container'}>
          <SidenavLinks />
        </div>
      </div>
      <WelcomeToNewDataWorld />
    </div>
  );
});
