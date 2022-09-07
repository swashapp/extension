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
              Become a verified Data Union member! Only verified members can
              withdraw their earnings.
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
