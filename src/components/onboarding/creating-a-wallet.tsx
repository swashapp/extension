import React, { memo } from 'react';

import CircularProgress from '../circular-progress/circular-progress';

export default memo(function CreatingAWallet() {
  return (
    <div className="onboarding-progress-card">
      <CircularProgress type="loading" />
      <h2>Creating a wallet...</h2>
      <p>One second, we are creating for you a new wallet.</p>
    </div>
  );
});
