import { ReactElement, useContext, useState } from 'react';

import { StepperContext } from '../../pages/onboarding';

import { AcceptCheckBox } from './accept-checkbox';
import { NavigationButtons } from './navigation-buttons';

export function OnboardingImportant(): ReactElement {
  const stepper = useContext(StepperContext);
  const [accept, setAccept] = useState<boolean>(false);
  return (
    <div className={'onboarding-block'}>
      <div className={'page-header'}>
        <h6>Important!</h6>
      </div>
      <div className={'round no-overflow bg-white card'}>
        <p>
          Keep your private key in a safe place.{' '}
          <b>
            You can share your wallet address but never share your private keys!
          </b>
          <br />
          <br />
          If you lose access and haven’t backed up your wallet,{' '}
          <b>you won’t be able to access your earnings.</b> Swash won’t be able
          to recover them for you. It’s your responsibility to be safe and
          secure.
        </p>
        <div className={'flex col'}>
          <AcceptCheckBox value={accept} setValue={setAccept} />
          <NavigationButtons
            onBack={stepper.back}
            onSubmit={accept ? stepper.next : () => undefined}
            disableNext={!accept}
          />
        </div>
      </div>
    </div>
  );
}
