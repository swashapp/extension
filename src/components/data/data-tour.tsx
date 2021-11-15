import React, { useContext } from 'react';

import { SidenavContext } from '../../pages/app';

import Tour, { TOUR_NAME } from '../tour/tour';

export enum DATA_TOUR_CLASS {
  SWASH_DATA = 'swash-data',
  DELAY_DATA = 'delay-data',
  TEXT_MASKING = 'text-masking',
}

export function DataTour(): JSX.Element {
  const sidenav = useContext(SidenavContext);
  return (
    <Tour
      tourName={TOUR_NAME.DATA}
      onStart={() => sidenav.setOpen(true)}
      steps={[
        {
          header: 'Data',
          target: `.${DATA_TOUR_CLASS.SWASH_DATA}`,
          placement: 'right',
          content: (
            <>
              Ever wondered what data is valuable? Data captured as you surf is
              collected here.
            </>
          ),
        },
        {
          header: 'Delay data ⏱',
          target: `.${DATA_TOUR_CLASS.DELAY_DATA}`,
          placement: 'right',
          content: (
            <>
              You can adjust the timer to delay it being added to the Swash Data
              Union, giving you time to review and edit your data points.
            </>
          ),
        },
        {
          header: 'Text masking 🛡',
          target: `.${DATA_TOUR_CLASS.TEXT_MASKING}`,
          placement: 'right',
          content: (
            <>
              Here, you’ll also find a pretty cool feature - text masking. Swash
              doesn’t collect any sensitive information anyway, but here you can
              add any other words you want Swash to ignore.
            </>
          ),
        },
      ]}
    />
  );
}
