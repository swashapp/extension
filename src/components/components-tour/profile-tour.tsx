import React from 'react';

import Tour, { TOUR_NAME } from '../tour/tour';

export enum PROFILE_TOUR_CLASS {
  COMPLETE_PROFILE = 'complete-profile-tour',
  VERIFY_PROFILE = 'verify-profile-tour',
}

export function ProfileTour(): JSX.Element {
  return (
    <Tour
      tourName={TOUR_NAME.PROFILE}
      steps={[
        {
          header: 'Introduce yourself 👋',
          target: `.${PROFILE_TOUR_CLASS.COMPLETE_PROFILE}`,
          placement: 'right',
          content: (
            <>
              Tell Swash you’re human by verifying your profile, so you’ll be
              able to earn even more from the value of your data.
            </>
          ),
        },
        {
          header: 'Get your 100 SWASH 🏆',
          target: `.${PROFILE_TOUR_CLASS.VERIFY_PROFILE}`,
          placement: 'right',
          content: <>Verify your profile to earn a 100 SWASH bonus!</>,
        },
      ]}
    />
  );
}
