import React, { ReactElement } from 'react';

import { CircularProgress } from '../circular-progress/circular-progress';

export function ImportingConfig(): ReactElement {
  return (
    <div
      className={'round flex col bg-white card text-center onboarding-block'}
    >
      <CircularProgress type={'uploading'} />
      <h6>Importing configuration...</h6>
      <p>One second, we are importing your configuration.</p>
    </div>
  );
}
