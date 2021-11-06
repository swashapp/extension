import React, { useCallback, useContext, useEffect, useState } from 'react';
import { toast } from 'react-toastify';

import { StepperContext } from '../../pages/onboarding';
import { UtilsService } from '../../service/utils-service';

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

  const [minutes, setMinutes] = useState<number>(2);
  const [seconds, setSeconds] = useState<number>(0);
  const triggerTimer = useCallback(() => setMinutes(2), []);
  useEffect(() => {
    const interval = setInterval(() => {
      if (seconds > 0) {
        setSeconds(seconds - 1);
      }
      if (seconds === 0) {
        if (minutes === 0) {
          clearInterval(interval);
        } else {
          setSeconds(59);
          setMinutes(minutes - 1);
        }
      }
    }, 1000);

    return () => {
      clearInterval(interval);
    };
  }, [minutes, seconds]);

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

  const onFailure = useCallback((err?: { message: string }) => {
    setLoading(false);
    toast(
      <ToastMessage
        type="error"
        content={<>{err?.message || 'Something went wrong!'}</>}
      />,
    );
  }, []);

  const join = useCallback(() => {
    window.helper
      .join(props.email, verificationCode)
      .then((res: { id: number; email: string }) => {
        if (res.id && res.email) {
          onVerified();
        } else {
          onFailure();
        }
      })
      .catch(onFailure);
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

  const onResend = useCallback(
    (e) => {
      e.preventDefault();
      setLoading(true);
      window.helper
        .resendCodeToEmail(props.email)
        .then(() => {
          triggerTimer();
          setLoading(false);
        })
        .catch(() => onFailure());
    },
    [onFailure, props.email, triggerTimer],
  );
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
            {seconds === 0 && minutes === 0 ? (
              <div
                style={{ display: 'inline-block' }}
                onClick={
                  loading
                    ? (e) => {
                        e.preventDefault();
                      }
                    : onResend
                }
              >
                <a style={{ color: 'var(--blue)' }} href="#">
                  Send me another code.
                </a>
              </div>
            ) : (
              <div style={{ color: 'var(--green)', display: 'inline-block' }}>
                {UtilsService.padWithZero(minutes) +
                  ':' +
                  UtilsService.padWithZero(seconds)}
              </div>
            )}
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
