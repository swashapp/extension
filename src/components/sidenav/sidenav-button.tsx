import { IconButton } from '@material-ui/core';
import React, { useContext } from 'react';

import { SidenavContext } from '../../pages/app';
import { SwashLogo } from '../swash-logo/swash-logo';
import { Toggle } from '../toggle/toggle';

const SidenavIcon = '/static/images/shape/sidenav.png';

export function SidenavButton(props: { isTourOn: boolean }): JSX.Element {
  const sidenav = useContext(SidenavContext);
  return (
    <div
      className={`sidenav-button-container ${
        sidenav.isOpen ? 'close-sidenav-button' : 'open-sidenav-button'
      } ${props.isTourOn ? 'sidenav-button' : 'sidenav-button-animation'}`}
    >
      <SwashLogo />
      <div className="flex-row sidenav-toggles">
        <Toggle />
        <IconButton onClick={() => sidenav.setOpen(true)}>
          <img src={SidenavIcon} alt={'#'} />
        </IconButton>
      </div>
    </div>
  );
}
