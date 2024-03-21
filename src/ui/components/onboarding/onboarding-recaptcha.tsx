import { ReactNode, useCallback, useContext } from "react";

import { Recaptcha } from "@/ui/components/recaptcha/recaptcha";
import { OnboardingContext } from "@/ui/context/onboarding.context";

export function OnboardingRecaptcha(): ReactNode {
  const { setChallenge, setReferral, back, next } =
    useContext(OnboardingContext);

  const onBack = useCallback(() => {
    setChallenge("");
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

  const onReferralReceived = useCallback(
    (referral: string) => {
      if (referral) {
        setReferral(referral);
        next();
      }
    },
    [next, setReferral],
  );

  return (
    <Recaptcha
      className={"round bg-white card32"}
      onBack={onBack}
      onTokenReceived={onTokenReceived}
      onReferralReceived={onReferralReceived}
    />
  );
}
