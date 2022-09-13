import React from 'react';

import Tour, { TOUR_NAME } from '../tour/tour';

export enum DONATION_TOUR_CLASS {
  SEARCH_CHARITY = 'search-charity',
  MAKE_DONATION = 'make-donation',
}

export function DonationTour(): JSX.Element {
  return (
    <Tour
      tourName={TOUR_NAME.DONATIONS}
      steps={[
        {
          header: 'Search for a charity 🐼',
          target: `.${DONATION_TOUR_CLASS.SEARCH_CHARITY}`,
          placement: 'right',
          content: (
            <>
              Browse, filter, and learn more about the organisations you can
              donate to through Swash. Don’t forget, new ones will be
              continuously added over time!
            </>
          ),
        },
        {
          header: 'Make a donation 🕊',
          target: `.${DONATION_TOUR_CLASS.MAKE_DONATION}`,
          placement: 'top',
          content: (
            <>
              When you make a donation, you can choose whether you want to do it
              as a one-off donation, or if you want to donate a percentage every
              month.
            </>
          ),
        },
      ]}
    />
  );
}
