import { ReactNode, useContext, useMemo, useState } from "react";

import { OnboardingPage } from "@/ui/components/onboarding/onboarding-page";
import { OnboardingContext } from "@/ui/context/onboarding.context";
import { isValidEmail } from "@/utils/validator.util";

import { AcceptCheckBox } from "../accept-checkbox/accept-checkbox";
import { InputBase } from "../input/input-base";
import { NavigationButtons } from "../navigation-buttons/navigation-buttons";

export function OnboardingCheckEmail(): ReactNode {
  const {
    email: contextEmail,
    setEmail: contextSetEmail,
    back,
    next,
  } = useContext(OnboardingContext);

  const [email, setEmail] = useState<string>(contextEmail);
  const [acceptAccess, setAcceptAccess] = useState<boolean>(false);
  const [acceptChange, setAcceptChange] = useState<boolean>(false);
  const [acceptProfile, setAcceptProfile] = useState<boolean>(false);
  const [error, setError] = useState<boolean>(false);

  const isOptionChecked = useMemo(
    () => acceptAccess && acceptChange && acceptProfile,
    [acceptAccess, acceptChange, acceptProfile],
  );

  return (
    <OnboardingPage title={"Email verification"}>
      <InputBase
        type={"email"}
        name={"email"}
        placeholder={"example@email.com"}
        value={email}
        error={error}
        onBlur={() => {
          setError(!isValidEmail(email));
        }}
        onChange={(e) => {
          setEmail(e.target.value);
        }}
      />
      <div className={"flex col gap12"}>
        <AcceptCheckBox
          value={acceptAccess}
          setValue={setAcceptAccess}
          text={<>I confirm that I can access this email address.</>}
        />
        <AcceptCheckBox
          value={acceptChange}
          setValue={setAcceptChange}
          text={
            <>I confirm that I understand I cannot change my email later.</>
          }
        />
        <AcceptCheckBox
          value={acceptProfile}
          setValue={setAcceptProfile}
          text={
            <>
              I confirm that I understand that I cannot access my profile
              without it.
            </>
          }
        />
      </div>
      <NavigationButtons
        onBack={() => back()}
        onNext={async () => {
          contextSetEmail(email);
          isOptionChecked ? next() : undefined;
        }}
        nextButtonText={"Confirm"}
        disableNext={error || !isOptionChecked}
      />
    </OnboardingPage>
  );
}
