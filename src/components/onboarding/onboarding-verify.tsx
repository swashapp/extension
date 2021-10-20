import React, { memo, useCallback, useContext, useState } from 'react';
import { toast } from 'react-toastify';

import { StepperContext } from '../../pages/onboarding';

import Input from '../input/input';

import ToastMessage from '../toast/toast-message';

import NavigationButtons from './navigation-buttons';

export default memo(function OnboardingVerify() {
  const stepper = useContext(StepperContext);
  const [verificationCode, setVerificationCode] = useState<string>();
  const [loading, setLoading] = useState<boolean>(false);

  const onSubmit = useCallback(() => {
    setLoading(true);
    new Promise((resolve) => setTimeout(resolve, 3000))
      .then(() => {
        stepper.next();
      })
      .catch(() =>
        toast(
          <ToastMessage type="error" content={<>Something went wrong!</>} />,
        ),
      )
      .finally(() => setLoading(false));
  }, [stepper]);
  return (
    <>
      <div className="onboarding-verify-email">
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
            value={verificationCode}
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
          onBack={stepper.back}
          onSubmit={onSubmit}
          loading={loading}
          disableNext={!verificationCode}
        />
      </div>
    </>
  );
});
