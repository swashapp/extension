import { ReactNode, useContext } from 'react';

import { SidenavContext } from '../../context/sidenav.context';
import { DisplayAds } from '../ads/display-ads';
import { SwashLogo } from '../swash-logo/swash-logo';

import { SidenavLinks } from './sidenav-links';

const CloseIcon = '/static/images/icons/sidenav/close.png';

export function Sidenav(props: { activeIndex?: number }): ReactNode {
  const { isOpen, setOpen } = useContext(SidenavContext);
  return (
    <div className={`flex col bg-white sidenav ${isOpen ? 'open' : 'close'}`}>
      {/*<SidenavButton />*/}
      <div className={'flex col justify-between'}>
        <div>
          <div className={'flex row justify-between align-center sidenav-logo'}>
            <SwashLogo />
            {isOpen ? (
              <div
                className={'sidenav-close-button'}
                onClick={() => setOpen(false)}
              >
                <img width={14} height={14} src={CloseIcon} alt={'x'} />
              </div>
            ) : null}
          </div>
          <div className={'flex col'}>
            <SidenavLinks activeIndex={props.activeIndex} />
          </div>
        </div>
        <div className={'sidenav-ads'}>
          <DisplayAds width={250} height={250} />
        </div>
      </div>
    </div>
  );
}
