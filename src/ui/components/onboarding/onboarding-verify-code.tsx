import { ReactNode, useContext } from 'react';

import { OnboardingContext } from '../../context/onboarding.context';

import { VerifyCode } from '../verify-code/verify-code';

export function OnboardingVerifyCode(): ReactNode {
  const { email, setCode, back, next } = useContext(OnboardingContext);

  return (
    <VerifyCode
      className={'round bg-white card32'}
      text={email}
      onBack={() => {
        back(2);
      }}
      onNext={(code) => {
        setCode(code);
        next();
      }}
      nextButtonText={'Register'}
    />
  );
}
