import { ReactNode, useContext, useState } from "react";

import { InputBase } from "@/ui/components/input/input-base";
import { NavigationButtons } from "@/ui/components/navigation-buttons/navigation-buttons";
import { OnboardingPage } from "@/ui/components/onboarding/onboarding-page";
import { OnboardingContext } from "@/ui/context/onboarding.context";

export function OnboardingReferralCode(): ReactNode {
  const {
    referral: contextReferral,
    setReferral: contextSetReferral,
    back,
    next,
  } = useContext(OnboardingContext);

  const [referral, setReferral] = useState<string>(contextReferral);

  return (
    <OnboardingPage title={"Set referral code"}>
      <p>
        You can increase your earnings by entering a referral code. If you
        don&apos;t have one or you don&apos;t want to use this feature, leave
        this field empty.
      </p>
      <div className={"flex col gap16"}>
        <InputBase
          name={"referral"}
          placeholder={"Enter referral code or leave it empty"}
          value={referral}
          onChange={(e) => {
            setReferral(e.target.value);
          }}
        />
      </div>
      <NavigationButtons
        onBack={() => back(2)}
        onNext={() => {
          contextSetReferral(referral);
          next();
        }}
        nextButtonText={"Submit"}
      />
    </OnboardingPage>
  );
}
