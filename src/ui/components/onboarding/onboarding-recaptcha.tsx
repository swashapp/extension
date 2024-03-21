import { ReactNode, useCallback, useContext } from 'react';

import { OnboardingContext } from '../../context/onboarding.context';
import { Recaptcha } from '../recaptcha/recaptcha';

export function OnboardingRecaptcha(): ReactNode {
  const { setChallenge, back, next } = useContext(OnboardingContext);

  const onBack = useCallback(() => {
    setChallenge('');
    back();
  }, [back, setChallenge]);

  const onTokenReceived = useCallback(
    (challenge: string) => {
      if (challenge) {
        setChallenge(challenge);
        next();
      }
    },
    [next, setChallenge],
  );

  return (
    <Recaptcha
      className={'round bg-white card32'}
      onBack={onBack}
      onTokenReceived={onTokenReceived}
    />
  );
}
