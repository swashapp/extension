import { IconButton } from '@material-ui/core';
import React, { Dispatch, memo, SetStateAction } from 'react';
// eslint-disable-next-line @typescript-eslint/ban-ts-comment
//@ts-ignore
import SidenavIcon from 'url:../../static/images/shape/sidenav.png';

import SwashLogo from '../swash-logo/swash-logo';

export default memo(function SidenavButton(props: {
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
});
