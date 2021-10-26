import React, { useCallback, useContext, useState } from 'react';
import { toast } from 'react-toastify';

import { StepperContext } from '../../pages/onboarding';
import { Input } from '../input/input';
import { ToastMessage } from '../toast/toast-message';

import { NavigationButtons } from './navigation-buttons';

export function OnboardingVerify(props: {
  email: string;
  onBack: () => void;
}): JSX.Element {
  const stepper = useContext(StepperContext);
  const [verificationCode, setVerificationCode] = useState<string>();
  const [loading, setLoading] = useState<boolean>(false);

  const onFailure = useCallback(() => {
    setLoading(false);
    toast(<ToastMessage type="error" content={<>Something went wrong!</>} />);
  }, []);

  const join = useCallback(() => {
    window.helper
      .join(props.email)
      .then((res) => {
        if (res.id && res.email) {
          setLoading(false);
          stepper.next();
        } else {
          onFailure();
        }
      })
      .catch(() => onFailure());
  }, [onFailure, props.email, stepper]);

  const updateEmail = useCallback(() => {
    window.helper
      .updateEmail(props.email)
      .then(() => {
        setLoading(false);
        stepper.next();
      })
      .catch(() => onFailure());
  }, [onFailure, props.email, stepper]);

  const onSubmit = useCallback(() => {
    setLoading(true);
    if (!stepper.join.id) {
      join();
    } else if (!stepper.join.email) {
      updateEmail();
    } else {
      stepper.next();
    }
  }, [join, stepper, updateEmail]);

  const onResend = useCallback(() => {
    setLoading(true);
    window.helper
      .resendCodeToEmail(props.email)
      .then((res: { valid: boolean }) => {
        if (res.valid) {
          setLoading(false);
          stepper.next();
        } else {
          onFailure();
        }
      })
      .catch(() => onFailure());
  }, [onFailure, props.email, stepper]);
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
            <a href="#" onClick={onResend}>
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
