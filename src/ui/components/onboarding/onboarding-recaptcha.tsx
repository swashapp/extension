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

  const onDataReceived = useCallback(
    ({ token, referral }: { token: string; referral: string }) => {
      if (referral) setReferral(referral);
      if (token) {
        setChallenge(token);
        next();
      }
    },
    [next, setChallenge, setReferral],
  );

  return (
    <Recaptcha
      className={"round bg-white card32"}
      onBack={onBack}
      onDataReceived={onDataReceived}
    />
  );
}
