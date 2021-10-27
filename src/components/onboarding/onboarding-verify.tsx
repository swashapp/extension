import React, { useCallback, useContext, useState } from 'react';
import { toast } from 'react-toastify';

import { StepperContext } from '../../pages/onboarding';
import { Input } from '../input/input';
import { ToastMessage } from '../toast/toast-message';

import { NavigationButtons } from './navigation-buttons';

const newsletter = 108293554;

export function OnboardingVerify(props: {
  email: string;
  stayUpdate: boolean;
  onBack: () => void;
}): JSX.Element {
  const stepper = useContext(StepperContext);
  const [verificationCode, setVerificationCode] = useState<string>();
  const [loading, setLoading] = useState<boolean>(false);

  const newsletterSignUp = useCallback(() => {
    window.helper.newsletterSignUp(props.email, newsletter).then();
  }, [props.email]);

  const onVerified = useCallback(() => {
    setLoading(false);
    if (props.stayUpdate) {
      newsletterSignUp();
    }
    stepper.next();
  }, [newsletterSignUp, props.stayUpdate, stepper]);

  const onFailure = useCallback(() => {
    setLoading(false);
    toast(<ToastMessage type="error" content={<>Something went wrong!</>} />);
  }, []);

  const join = useCallback(() => {
    window.helper
      .join(props.email, verificationCode)
      .then((res) => {
        if (res.id && res.email) {
          onVerified();
        } else {
          onFailure();
        }
      })
      .catch(() => onFailure());
  }, [onFailure, onVerified, props.email, verificationCode]);

  const updateEmail = useCallback(() => {
    window.helper
      .updateEmail(props.email, verificationCode)
      .then(() => onVerified())
      .catch(() => onFailure());
  }, [onFailure, onVerified, props.email, verificationCode]);

  const onSubmit = useCallback(() => {
    setLoading(true);
    if (!stepper.join.id) {
      join();
    } else if (!stepper.join.email) {
      updateEmail();
    } else {
      onVerified();
    }
  }, [join, onVerified, stepper.join.email, stepper.join.id, updateEmail]);

  const onResend = useCallback(() => {
    setLoading(true);
    window.helper
      .resendCodeToEmail(props.email)
      .then(() => setLoading(false))
      .catch(() => onFailure());
  }, [onFailure, props.email]);
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
