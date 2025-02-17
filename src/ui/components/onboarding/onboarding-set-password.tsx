import { ReactNode, useContext, useMemo, useState } from "react";

import { InputBase } from "@/ui/components/input/input-base";
import { NavigationButtons } from "@/ui/components/navigation-buttons/navigation-buttons";
import { OnboardingPage } from "@/ui/components/onboarding/onboarding-page";
import { OnboardingContext } from "@/ui/context/onboarding.context";
import { isValidPassword } from "@/utils/validator.util";

export function OnboardingSetPassword(): ReactNode {
  const { setPassword, back, next } = useContext(OnboardingContext);

  const [masterPass, setMasterPass] = useState<string>("");
  const [confirmMasterPass, setConfirmMasterPass] = useState<string>("");

  const isPasswordValid = useMemo(
    () => masterPass === confirmMasterPass && isValidPassword(masterPass),
    [masterPass, confirmMasterPass],
  );

  return (
    <OnboardingPage title={"Create your master password"}>
      <p>
        Your master password will allow you to enter your Swash account on
        multiple devices. Store it in a safe place and keep it to yourself to
        maintain your security.
      </p>
      <div className={"flex col gap16"}>
        <InputBase
          type={"password"}
          name={"password"}
          placeholder={"Enter your master password"}
          value={masterPass}
          autoFocus={true}
          onChange={(e) => {
            setMasterPass(e.target.value);
          }}
        />
        <InputBase
          type={"password"}
          name={"confirm password"}
          placeholder={"Enter your master password again"}
          value={confirmMasterPass}
          onChange={(e) => {
            setConfirmMasterPass(e.target.value);
          }}
        />
      </div>
      <NavigationButtons
        onBack={() => back()}
        onNext={() => {
          if (isPasswordValid) {
            setPassword(masterPass);
            next();
          }
        }}
        nextButtonText={"Set password"}
        disableNext={!isPasswordValid}
      />
    </OnboardingPage>
  );
}
