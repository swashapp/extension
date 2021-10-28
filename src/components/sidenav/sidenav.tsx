import React from 'react';

import { SwashLogo } from '../swash-logo/swash-logo';

import { SidenavLinks } from './sidenav-links';
import { WelcomeToNewDataWorld } from './welcome-to-new-data-world';

const CloseIcon = '/static/images/shape/close.svg';

export function Sidenav(props: {
  activeIndex?: number;
  onClose: () => void;
}): JSX.Element {
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
}
