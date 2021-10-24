import React, { useCallback, useContext, useState } from 'react';
import { toast } from 'react-toastify';

import { StepperContext } from '../../pages/onboarding';
import { Input } from '../input/input';
import { ToastMessage } from '../toast/toast-message';

import { NavigationButtons } from './navigation-buttons';

export function OnboardingVerify(props: { onBack: () => void }): JSX.Element {
  const stepper = useContext(StepperContext);
  const [verificationCode, setVerificationCode] = useState<string>();
  const [loading, setLoading] = useState<boolean>(false);

  const onSubmit = useCallback(() => {
    setLoading(true);
    new Promise((resolve) => setTimeout(resolve, 3000))
      .then(() => {
        setLoading(false);
        stepper.next();
      })
      .catch(() => {
        setLoading(false);

        toast(
          <ToastMessage type="error" content={<>Something went wrong!</>} />,
        );
      });
  }, [stepper]);
  return (
    <div className="onboarding-verify-email">
      <div className="flex-column onboarding-verify-email-content">
        <h2>Check your email!</h2>
        <div className="onboarding-verify-text">
          <p>
            We have sent you a verification code, please verify your email
            address to continue.
          </p>
        </div>
        <div className="onboarding-verify-input">
          <Input
            label="Verification Code"
            defaultValue={verificationCode}
            onChange={(e) => setVerificationCode(e.target.value)}
          />
        </div>
        <div className="onboarding-verify-question">
          <p>
            Don&apos;t work?{' '}
            <a href="#" onClick={() => undefined}>
              Send me another code.
            </a>
          </p>
        </div>
        <NavigationButtons
          nextButtonText="Verify"
          onBack={props.onBack}
          onSubmit={onSubmit}
          loading={loading}
          disableNext={!verificationCode}
        />
      </div>
    </div>
  );
}
