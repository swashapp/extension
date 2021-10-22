import React, { useContext, useEffect } from 'react';

import { StepperContext } from '../../pages/onboarding';

import { CircularProgress } from '../circular-progress/circular-progress';

export function CreatingAWallet(): JSX.Element {
  const stepper = useContext(StepperContext);
  useEffect(() => {
    window.helper.createAndSaveWallet().then(() => {
      stepper.next();
    });
  });
  return (
    <div className="onboarding-progress-card">
      <CircularProgress type="loading" />
      <h2>Creating a wallet...</h2>
      <p>One second, we are creating for you a new wallet.</p>
    </div>
  );
}
