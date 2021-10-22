import React from 'react';

import { CircularProgress } from '../circular-progress/circular-progress';

export function ImportingConfig(): JSX.Element {
  return (
    <div className="onboarding-progress-card">
      <CircularProgress type="uploading" />
      <h2>Importing configuration...</h2>
      <p>One second, we are importing your configuration.</p>
    </div>
  );
}
