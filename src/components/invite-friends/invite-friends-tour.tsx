import React from 'react';

import Tour, { TOUR_NAME } from '../tour/tour';

export enum INVITE_FRIENDS_TOUR_CLASS {
  REFERRAL = 'referral-link',
  FRIENDS = 'friends-count',
}

export function InviteFriendsTour(): JSX.Element {
  return (
    <Tour
      tourName={TOUR_NAME.INVITE_FRIENDS}
      steps={[
        {
          header: 'Referral Link',
          target: `.${INVITE_FRIENDS_TOUR_CLASS.REFERRAL}`,
          placement: 'right',
          content: (
            <>
              If you want to bring your friends to Swash, make sure to use your
              referral link! There are regular referral programs and giveaways
              for members who are actively growing the community, don’t miss
              out!
            </>
          ),
        },
        {
          header: 'Number Of Friends',
          target: `.${INVITE_FRIENDS_TOUR_CLASS.FRIENDS}`,
          placement: 'right',
          content: (
            <>
              You can check your referral earning balance and the number of
              friends you’ve invited here too.
            </>
          ),
        },
      ]}
    />
  );
}
