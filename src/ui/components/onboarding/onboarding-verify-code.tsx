import { ReactNode, useContext } from "react";

import { VerifyCode } from "@/ui/components/verify-code/verify-code";
import { OnboardingContext } from "@/ui/context/onboarding.context";

export function OnboardingVerifyCode(): ReactNode {
  const { email, setCode, resetRequestId, back, next } =
    useContext(OnboardingContext);

  return (
    <VerifyCode
      className={"round bg-white card32"}
      text={email}
      nextButtonText={"Submit"}
      onBack={() => back()}
      onNext={(code) => {
        setCode(code);
        next();
      }}
      onResetCountdown={resetRequestId}
    />
  );
}
