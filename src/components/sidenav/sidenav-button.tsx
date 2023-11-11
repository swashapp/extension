import { IconButton } from '@mui/material';
import React, { useContext } from 'react';

import { SidenavContext } from '../../pages/app';
import { SwashLogo } from '../swash-logo/swash-logo';
import { Toggle } from '../toggle/toggle';

const SidenavIcon = '/static/images/shape/sidenav.png';

export function SidenavButton(): JSX.Element {
  const sidenav = useContext(SidenavContext);
  return (
    <div
      className={`sidenav-button-container ${
        sidenav.isOpen ? 'close-sidenav-button' : 'open-sidenav-button'
      } sidenav-button-animation`}
    >
      <SwashLogo />
      <div className="flex-row sidenav-toggles">
        <Toggle />
        <IconButton onClick={() => sidenav.setOpen(true)} size="large">
          <img src={SidenavIcon} alt={'#'} />
        </IconButton>
      </div>
    </div>
  );
}
