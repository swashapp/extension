import React, { useContext } from 'react';

import { SidenavContext } from '../../pages/app';

import Tour, { TOUR_NAME } from '../tour/tour';

export enum WALLET_TOUR_CLASS {
  WALLET = 'wallet-title',
  DATA_EARNINGS = 'data-earnings',
  WALLET_ADDRESS = 'wallet-address',
}

export function WalletTour(): JSX.Element {
  const sidenav = useContext(SidenavContext);
  return (
    <Tour
      tourName={TOUR_NAME.WALLET}
      onStart={() => sidenav.setOpen(true)}
      steps={[
        {
          header: 'Swash Wallet',
          target: `.${WALLET_TOUR_CLASS.WALLET}`,
          placement: 'right',
          content: (
            <>
              Here’s your Swash wallet. This is where you can view your balance,
              find your public wallet address, and withdraw your earnings.
            </>
          ),
        },
        {
          header: 'Data Earnings',
          target: `.${WALLET_TOUR_CLASS.DATA_EARNINGS}`,
          placement: 'right',
          content: (
            <>
              Your earnings are generated when your captured data is sold. You
              don’t need to do anything, just leave Swash switched on and surf
              the web as normal.
            </>
          ),
        },
        {
          header: 'Wallet Address',
          target: `.${WALLET_TOUR_CLASS.WALLET_ADDRESS}`,
          placement: 'right',
          content: (
            <>
              Your public wallet address is like an account number. You can
              share it to receive crypto into your wallet.
            </>
          ),
        },
      ]}
    />
  );
}
