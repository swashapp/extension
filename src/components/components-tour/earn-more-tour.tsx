import React, { useContext } from 'react';

import { SidenavContext } from '../../pages/app';
import Tour, { TOUR_NAME } from '../tour/tour';

export enum EARN_MORE_TOUR_CLASS {
  EARN_MORE = 'earn-more-tour',
  AMPLIFY_EARNINGS = 'amplify-earnings-tour',
  NEW_TAB = 'new-tab-tour',
}

export function EarnMoreTour(): JSX.Element {
  const sidenav = useContext(SidenavContext);
  return (
    <Tour
      tourName={TOUR_NAME.EARN_MORE}
      onStart={() => sidenav.setOpen(true)}
      steps={[
        {
          header: 'Earn More with Swash 🚀',
          target: `.${EARN_MORE_TOUR_CLASS.EARN_MORE}`,
          placement: 'right',
          content: (
            <>
              Opt-in to turbo boost your earnings by receiving Swash ads on any
              browser.
            </>
          ),
        },
        {
          header: 'Amplify your earnings ⚡️',
          target: `.${EARN_MORE_TOUR_CLASS.AMPLIFY_EARNINGS}`,
          placement: 'right',
          content: (
            <>
              Soon, you’ll be able to opt-in to complete surveys, watch videos,
              take quizzes and much more as part of Earn More.
            </>
          ),
        },
        {
          header: 'Give your new tab a glow up 🪄',
          target: `.${EARN_MORE_TOUR_CLASS.NEW_TAB}`,
          placement: 'right',
          content: (
            <>
              Earn from full page ads and fully customise your tab to include
              widgets, jokes, gifs, and more with the New Tab Experience.
            </>
          ),
        },
      ]}
    />
  );
}
