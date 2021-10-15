import React, { memo, useState } from 'react';

import Input from '../input/input';

import NavigationButtons from './navigation-buttons';

export default memo(function OnBoardingVerify(props: {
  onSubmit: () => void;
  onBack: () => void;
}) {
  const [verificationCode, setVerificationCode] = useState<string>();
  const [loading, setLoading] = useState<boolean>(false);
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
          onBack={props.onBack}
          onSubmit={() => props.onSubmit()}
          loading={loading}
          disableNext={!verificationCode}
        />
      </div>
    </>
  );
});
