import React, { useContext } from 'react';

import { SidenavContext } from '../../pages/app';

import { DisplayAds } from '../ads/display-ads';
import { SwashLogo } from '../swash-logo/swash-logo';

import { SidenavLinks } from './sidenav-links';

const CloseIcon = '/static/images/icons/sidenav/close.png';

export function Sidenav(props: { activeIndex?: number }): JSX.Element {
  const sidenav = useContext(SidenavContext);
  return (
    <div className={'sidenav-container'}>
      <div>
        <div className={'sidenav-logo'}>
          <SwashLogo />
          {sidenav.isOpen ? (
            <div
              className={'sidenav-close-button'}
              onClick={() => sidenav.setOpen(false)}
            >
              <img width={14} height={14} src={CloseIcon} alt={'x'} />
            </div>
          ) : (
            <></>
          )}
        </div>
        <div className={'sidenav-links-container'}>
          <SidenavLinks activeIndex={props.activeIndex} />
        </div>
      </div>
      <div className={'sidenav-ads'}>
        <DisplayAds width={250} height={250} />
      </div>
    </div>
  );
}
