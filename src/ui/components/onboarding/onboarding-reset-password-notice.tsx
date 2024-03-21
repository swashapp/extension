import { ReactNode, useContext } from "react";

import { ButtonColors } from "@/enums/button.enum";
import { BackButton } from "@/ui/components/button/back";
import { Button } from "@/ui/components/button/button";
import { OnboardingPage } from "@/ui/components/onboarding/onboarding-page";
import { OnboardingContext } from "@/ui/context/onboarding.context";

export function OnboardingResetPasswordNotice(): ReactNode {
  const { back, next } = useContext(OnboardingContext);

  return (
    <OnboardingPage
      title={"Reset your master password"}
      navigation={
        <BackButton
          text={"Go back to restore options"}
          onClick={() => back()}
        />
      }
    >
      <div className={"flex col gap16"}>
        <p>
          Resetting your password means you{" "}
          <span className={"bold"}>reset your account</span>. You can assign
          your new account to the same email address, but you will lose your
          existing funds.
          <br />
          <br />
          If you would like to proceed, click the button below to start the
          password reset process.
        </p>
      </div>
      <Button
        text={"Continue to reset password"}
        className={"full-width-button"}
        color={ButtonColors.PRIMARY}
        onClick={() => next()}
      />
    </OnboardingPage>
  );
}
