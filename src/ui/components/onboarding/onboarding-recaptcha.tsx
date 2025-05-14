import { ReactNode, useCallback, useContext } from "react";

import { Recaptcha } from "@/ui/components/recaptcha/recaptcha";
import { OnboardingContext } from "@/ui/context/onboarding.context";

export function OnboardingRecaptcha(): ReactNode {
  const { setChallenge, setReferral, setDeviceKey, back, next } =
    useContext(OnboardingContext);

  const onBack = useCallback(() => {
    setChallenge("");
    back();
  }, [back, setChallenge]);

  const onDataReceived = useCallback(
    ({
      token,
      referral,
      device,
    }: {
      token: string;
      referral: string;
      device: string;
    }) => {
      if (referral) setReferral(referral);
      if (device) setDeviceKey(device);
      if (token) {
        setChallenge(token);
        next();
      }
    },
    [next, setChallenge, setDeviceKey, setReferral],
  );

  return (
    <Recaptcha
      className={"round bg-white card32"}
      onBack={onBack}
      onDataReceived={onDataReceived}
    />
  );
}
