import React, { useContext } from 'react';

import { SidenavContext } from '../../pages/app';

import Tour, { TOUR_NAME } from '../tour/tour';

export enum HELP_TOUR_CLASS {
  SWASH_HELP = 'swash-help',
  SEARCH_HELP = 'search-help',
  TOUR = 'tour-help',
}

export function HelpTour(): JSX.Element {
  const sidenav = useContext(SidenavContext);
  return (
    <Tour
      tourName={TOUR_NAME.HELP}
      onStart={() => sidenav.setOpen(true)}
      steps={[
        {
          header: 'Help',
          target: `.${HELP_TOUR_CLASS.SWASH_HELP}`,
          placement: 'right',
          content: (
            <>
              Got a question? The Help section tells you everything you need to
              know about the Swash app.
            </>
          ),
        },
        {
          header: 'Search at Help',
          target: `.${HELP_TOUR_CLASS.SEARCH_HELP}`,
          placement: 'right',
          content: (
            <>
              Learn more about your wallet, referrals, settings, data, and other
              useful links here.
            </>
          ),
        },
        {
          header: 'Tour',
          target: `.${HELP_TOUR_CLASS.TOUR}`,
          placement: 'right',
          content: (
            <>If you ever want to see this tour again, you can find it here.</>
          ),
        },
      ]}
    />
  );
}
