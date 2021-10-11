import SwashLogo from '../swash-logo/swash-logo';
import React, { Dispatch, SetStateAction } from 'react';
import { IconButton } from '@material-ui/core';
import SidenavIcon from 'url:../../static/images/shape/sidenav.png';

export default function SidenavButton(props: {
  sidenavOpen: boolean;
  setSidenavOpen: Dispatch<SetStateAction<boolean>>;
}) {
  return (
    <div
      className={`sidenav-button-container ${
        props.sidenavOpen ? 'close-sidenav-button' : 'open-sidenav-button'
      }`}
    >
      <SwashLogo />
      <IconButton onClick={() => props.setSidenavOpen(true)}>
        <img src={SidenavIcon} alt={'#'} />
      </IconButton>
    </div>
  );
}
