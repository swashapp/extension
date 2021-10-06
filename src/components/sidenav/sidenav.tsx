import React, { memo } from 'react';

import SwashLogo from '../swash-logo/swash-logo';

import SidenavLinks from './sidenav-links';
import WelcomeToNewDataWorld from './welcome-to-new-data-world';
import CloseIcon from 'url:../../static/images/shape/close.svg';

export default memo(function Sidenav(props: {
  activeIndex?: number;
  onClose: () => void;
}) {
  return (
    <div className={'sidenav-container'}>
      <div>
        <div className={'sidenav-logo'}>
          <SwashLogo />
          <div
            className={'sidenav-close-button'}
            onClick={() => props.onClose && props.onClose()}
          >
            <img width={24} height={24} src={CloseIcon} alt={'x'} />
          </div>
        </div>
        <div className={'sidenav-links-container'}>
          <SidenavLinks activeIndex={props.activeIndex} />
        </div>
      </div>
      <WelcomeToNewDataWorld />
    </div>
  );
});
