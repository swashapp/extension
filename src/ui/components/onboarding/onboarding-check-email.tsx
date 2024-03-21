import { ReactNode, useContext, useMemo, useState } from "react";

import { Checkbox } from "@/ui/components/checkbox/checkbox";
import { InputBase } from "@/ui/components/input/input-base";
import { NavigationButtons } from "@/ui/components/navigation-buttons/navigation-buttons";
import { OnboardingPage } from "@/ui/components/onboarding/onboarding-page";
import { OnboardingContext } from "@/ui/context/onboarding.context";
import { isValidEmail } from "@/utils/validator.util";

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
        <Checkbox
          checked={acceptAccess}
          onChange={() => {
            setAcceptAccess(!acceptAccess);
          }}
          label={
            <p className={"small"}>
              I confirm that I can access this email address.
            </p>
          }
        />
        <Checkbox
          checked={acceptChange}
          onChange={() => {
            setAcceptChange(!acceptChange);
          }}
          label={
            <p className={"small"}>
              I confirm that I understand I cannot change my email later.
            </p>
          }
        />
        <Checkbox
          checked={acceptProfile}
          onChange={() => {
            setAcceptProfile(!acceptProfile);
          }}
          label={
            <p className={"small"}>
              I confirm that I understand that I cannot access my profile
              without it.
            </p>
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
