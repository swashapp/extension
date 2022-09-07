import React, { useContext } from 'react';

import { SidenavContext } from '../../pages/app';

import Tour, { TOUR_NAME } from '../tour/tour';

export enum WALLET_TOUR_CLASS {
  WALLET = 'wallet-title',
  SWASH_EARNINGS = 'swash-earnings',
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
          header: 'Meet your wallet 💰',
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
          header: 'SWASH Earnings 💸',
          target: `.${WALLET_TOUR_CLASS.SWASH_EARNINGS}`,
          placement: 'right',
          content: (
            <>
              All earnings received within the Swash ecosystem are in Swash’s
              native token, SWASH.
            </>
          ),
        },
        {
          header: 'Your wallet address 📩',
          target: `.${WALLET_TOUR_CLASS.WALLET_ADDRESS}`,
          placement: 'right',
          content: (
            <>
              Your public wallet address is your unique identifier in the Swash
              ecosystem.
            </>
          ),
        },
      ]}
    />
  );
}
