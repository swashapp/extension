import { ReactNode, useContext } from "react";

import { ButtonColors } from "@/enums/button.enum";
import { OnboardingFlows } from "@/enums/onboarding.enum";
import { BackButton } from "@/ui/components/button/back";
import { Button } from "@/ui/components/button/button";
import { OnboardingPage } from "@/ui/components/onboarding/onboarding-page";
import { OnboardingContext } from "@/ui/context/onboarding.context";

export function OnboardingRestoreOptions(): ReactNode {
  const { setFlow, back, next } = useContext(OnboardingContext);

  return (
    <OnboardingPage
      title={"Restore your credentials"}
      navigation={
        <BackButton text={"Go back to log in"} onClick={() => back()} />
      }
    >
      <div className={"flex col gap24"}>
        <p>Select one of the options below:</p>
        <div className={"flex col gap24"}>
          <Button
            text={"I have my backup file/private key"}
            className={"full-width-button"}
            color={ButtonColors.SECONDARY}
            onClick={() => {
              setFlow(OnboardingFlows.RESTORE_BACKUP);
              next();
            }}
          />
          <Button
            text={"I remember my email, but forgot my password"}
            className={"full-width-button"}
            color={ButtonColors.SECONDARY}
            onClick={() => {
              setFlow(OnboardingFlows.RESET_PASSWORD);
              next();
            }}
          />
          <Button
            text={"I forgot my email, password, and backup file/private key"}
            className={"full-width-button"}
            color={ButtonColors.SECONDARY}
            onClick={() => {
              setFlow(OnboardingFlows.SETUP_ACCOUNT);
              next();
            }}
          />
        </div>
      </div>
    </OnboardingPage>
  );
}
