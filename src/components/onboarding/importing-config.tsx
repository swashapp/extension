import React from 'react';

import { CircularProgress } from '../circular-progress/circular-progress';

export function ImportingConfig(): JSX.Element {
  return (
    <div
      className={'onboarding-block round flex col bg-white card text-center'}
    >
      <CircularProgress type={'uploading'} />
      <h6>Importing configuration...</h6>
      <p>One second, we are importing your configuration.</p>
    </div>
  );
}
