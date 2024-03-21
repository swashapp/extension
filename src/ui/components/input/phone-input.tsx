import clsx from "clsx";
import { useState } from "react";
import MuiPhoneInput from "react-phone-input-2";

import { isValidPhoneNumber } from "@/utils/validator.util";

import { NavigationButtons } from "../navigation-buttons/navigation-buttons";

import "react-phone-input-2/lib/material.css";
import "./react-tel-input.css";
import styles from "./phone-input.module.css";

export function PhoneInput({
  className = "",
  onBack,
  onNext,
  nextButtonText,
}: {
  className?: string;
  onBack: () => void;
  onNext: (code: string) => void;
  nextButtonText: string;
}) {
  const [phone, setPhone] = useState<string>("");
  const [isValid, setIsValid] = useState<boolean>(false);

  return (
    <div className={clsx("flex col gap40", styles.container)}>
      <h6>Verify phone number</h6>
      <div
        className={clsx("flex col gap40", className)}
        style={{ overflow: "visible" }}
      >
        <p>
          Once your mobile is verified, you’ll enjoy a fully unlocked account,
          giving you access to every aspect of Swash account.
        </p>
        <MuiPhoneInput
          enableSearch
          enableLongNumbers={12}
          inputProps={{ maxLength: 20 }}
          country={"us"}
          value={phone}
          onChange={(phone) => {
            setPhone(`+${phone}`);
            setIsValid(isValidPhoneNumber(phone));
          }}
          dropdownStyle={{ zIndex: 1000 }}
        />
        <NavigationButtons
          onBack={onBack}
          onNext={() => {
            onNext(phone);
          }}
          nextButtonText={nextButtonText}
          disableNext={!isValid}
        />
      </div>
    </div>
  );
}
