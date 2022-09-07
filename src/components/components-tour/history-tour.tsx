import React from 'react';

import Tour, { TOUR_NAME } from '../tour/tour';

export enum HISTORY_TOUR_CLASS {
  ARCHIVES = 'archive-history',
}

export function HistoryTour(): JSX.Element {
  return (
    <Tour
      tourName={TOUR_NAME.HISTORY}
      steps={[
        {
          header: 'Dig in to the archives 📚',
          target: `.${HISTORY_TOUR_CLASS.ARCHIVES}`,
          placement: 'right',
          content: (
            <>
              All of your withdrawal and claim history will be logged here for
              your reference.
            </>
          ),
        },
      ]}
    />
  );
}
