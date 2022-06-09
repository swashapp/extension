import React, { useContext, useEffect, useState } from 'react';

import { SidenavContext } from '../../pages/app';

import { SwashLogo } from '../swash-logo/swash-logo';

import { SidenavLinks } from './sidenav-links';
import { WelcomeToNewDataWorld } from './welcome-to-new-data-world';

const CloseIcon = '/static/images/icons/sidenav/close.png';

export function Sidenav(props: { activeIndex?: number }): JSX.Element {
  const [wallet, setWallet] = useState('');
  const sidenav = useContext(SidenavContext);

  useEffect(() => {
    window.helper
      .getWalletAddress()
      .then((address: string) => {
        console.log('address', address);
        setWallet(address);
      })
      .catch((err: any) => {
        console.log('error', err);
        setWallet('');
      });
  }, []);

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
      {/*<WelcomeToNewDataWorld />*/}
      <div id="sidenav_ads" className="swash-inpage-ads">
        <div
          className="c25b4ef591762a17"
          data-zone="s1"
          data-pay-to={`eth:${wallet}`}
          data-page="extension"
          style={{
            width: 120,
            height: 240,
            display: 'inline-block',
            margin: '0 auto',
          }}
        />
        <div
          className="c25b4ef591762a17"
          data-zone="s2"
          data-pay-to={`eth:${wallet}`}
          data-page="extension"
          style={{
            width: 300,
            height: 250,
            display: 'inline-block',
            margin: '0 auto',
          }}
        />
      </div>
    </div>
  );
}
