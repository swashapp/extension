import { ReactNode, useCallback, useContext, useState } from "react";

import { ButtonColors } from "@/enums/button.enum";
import { SUPPORT_URLS } from "@/paths";
import { BackButton } from "@/ui/components/button/back";
import { Button } from "@/ui/components/button/button";
import { InputBase } from "@/ui/components/input/input-base";
import { OnboardingPage } from "@/ui/components/onboarding/onboarding-page";
import { OnboardingContext } from "@/ui/context/onboarding.context";
import { isValidEmail } from "@/utils/validator.util";

export function OnboardingResetPasswordEmail(): ReactNode {
  const {
    email: contextEmail,
    setEmail: contextSetEmail,
    back,
    next,
  } = useContext(OnboardingContext);
  const [email, setEmail] = useState<string>(contextEmail);
  const [acceptEmail, setAcceptEmail] = useState<boolean | undefined>();

  const isEmailValid = useCallback(() => {
    setAcceptEmail(isValidEmail(email));
  }, [email]);

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
        <p>Enter your email address:</p>
      </div>
      <InputBase
        type={"email"}
        name={"email"}
        placeholder={"example@email.com"}
        value={email}
        error={acceptEmail === false}
        onBlur={isEmailValid}
        onChange={(e) => {
          setEmail(e.target.value);
        }}
      />
      <div className={"flex col gap16"}>
        <Button
          text={"Reset password"}
          className={"full-width-button"}
          color={ButtonColors.PRIMARY}
          disabled={!acceptEmail}
          onClick={() => {
            contextSetEmail(email);
            next();
          }}
        />
        <p>
          Still having trouble?{" "}
          <a href={SUPPORT_URLS.home} target={"_blank"} rel={"noreferrer"}>
            <span className={"bold"}>Get help</span>
          </a>
        </p>
      </div>
    </OnboardingPage>
  );
}
