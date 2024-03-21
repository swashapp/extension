import { ReactElement, useContext, useEffect } from 'react';

import { helper } from '../../core/webHelper';
import { StepperContext } from '../../pages/onboarding';

import { CircularProgress } from '../circular-progress/circular-progress';

export function CreatingAWallet(): ReactElement {
  const stepper = useContext(StepperContext);
  useEffect(() => {
    helper.createAndSaveWallet().then(() => {
      stepper.next();
    });
  });
  return (
    <div
      className={'round flex col bg-white card text-center onboarding-block'}
    >
      <CircularProgress type={'loading'} />
      <h6>Creating a wallet...</h6>
      <p>One second, we are creating for you a new wallet.</p>
    </div>
  );
}
