import Input from '../input/input';
import React, { useState } from 'react';
import NavigationButtons from './navigation-buttons';

export default function OnBoardingVerifiy(props: {
  onSubmit: () => void;
  onBack: () => void;
}) {
  const [verificationCode, setVerificationCode] = useState<string>();
  const [loading, setLoading] = useState<boolean>(false);
  return (
    <>
      <div className="on-boarding-verify-email">
        <h2>Check your email!</h2>
        <div className="on-boarding-verify-text">
          <p>
            We have sent you a verification code, please verify your email
            address to continue.
          </p>
        </div>
        <div className="on-boarding-verify-input">
          <Input
            label="Vertification Code"
            value={verificationCode}
            onChange={(e) => setVerificationCode(e.target.value)}
          />
        </div>
        <div className="on-boarding-verify-question">
          <p>
            Dont work?{' '}
            <a href="#" className="link-in-text" onClick={() => {}}>
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
}
