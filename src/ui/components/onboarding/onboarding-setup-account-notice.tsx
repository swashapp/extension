import { ReactNode, useContext } from "react";

import { ButtonColors } from "@/enums/button.enum";
import { BackButton } from "@/ui/components/button/back";
import { Button } from "@/ui/components/button/button";
import { OnboardingPage } from "@/ui/components/onboarding/onboarding-page";
import { OnboardingContext } from "@/ui/context/onboarding.context";

export function OnboardingSetupAccountNotice(): ReactNode {
  const { back, next } = useContext(OnboardingContext);

  return (
    <OnboardingPage
      title={"Set up new account"}
      navigation={
        <BackButton
          text={"Go back to restore options"}
          onClick={() => back()}
        />
      }
    >
      <div className={"flex col gap16"}>
        <p>
          To continue using Swash, you need to set up an account as a new user.
          You can do that by signing up by clicking the button below.
        </p>
      </div>
      <Button
        text={"Create new account"}
        className={"full-width-button"}
        color={ButtonColors.PRIMARY}
        onClick={() => next()}
      />
    </OnboardingPage>
  );
}
