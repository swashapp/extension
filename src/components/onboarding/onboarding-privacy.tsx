import React, { useContext, useState } from 'react';

import { StepperContext } from '../../pages/onboarding';

import { PathToUrls } from '../../paths';

import { AcceptCheckBox } from './accept-checkbox';
import { NavigationButtons } from './navigation-buttons';

export function OnboardingPrivacy(): JSX.Element {
  const stepper = useContext(StepperContext);
  const [accept, setAccept] = useState<boolean>(false);
  return (
    <>
      <div className="page-header onboarding-header">
        <h2>Swash Privacy Policy</h2>
      </div>
      <div className="simple-card">
        <p>
          Before we start, check out the{' '}
          <a href={PathToUrls.terms} target={'_blank'} rel="noreferrer">
            Terms of Service
          </a>{' '}
          so you know what to expect when using Swash.
          <br />
          <br />
          Also, as Swash captures your data to then sell it on your behalf, it’s
          important that you read and understand what that involves before
          continuing. You can find everything you need to know in the{' '}
          <a href={PathToUrls.privacy} target={'_blank'} rel="noreferrer">
            Privacy Policy
          </a>
          .
          <br />
          <br />
          You can always visit the Privacy Policy and Terms of Service through
          the Help section in the app or through the Swash website.
        </p>
        <div className="flex-column">
          <AcceptCheckBox value={accept} setValue={setAccept} />
          <NavigationButtons
            onBack={stepper.back}
            onSubmit={accept ? stepper.next : () => undefined}
            disableNext={!accept}
          />
        </div>
      </div>
    </>
  );
}
