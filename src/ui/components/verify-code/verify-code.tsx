import clsx from "clsx";
import { ReactNode, useMemo, useState } from "react";

import { InputBase } from "../input/input-base";
import { NavigationButtons } from "../navigation-buttons/navigation-buttons";

import styles from "./verify-code.module.css";

export function VerifyCode({
  className = "",
  text,
  onBack,
  onNext,
  nextButtonText,
}: {
  className?: string;
  text: string;
  onBack: () => void;
  onNext: (code: string) => void;
  nextButtonText: string;
}): ReactNode {
  const [code, setCode] = useState("");

  const isCodeValid = useMemo(() => code.length >= 6, [code.length]);

  return (
    <div className={clsx("flex col gap40", styles.container)}>
      <h6>Check your {text.includes("@") ? "email" : "phone"}</h6>
      <div className={clsx("flex col gap40", className)}>
        <p>
          We have sent {text} a verification code. Please enter the code you
          received below to proceed with the verification process.
        </p>
        <InputBase
          type={"text"}
          name={"code"}
          placeholder={"Enter your verification code"}
          value={code}
          onChange={(e) => {
            const { value } = e.target;
            const numericValue = value.replace(/[^0-9]/g, "");
            setCode(numericValue);
          }}
        />
        <NavigationButtons
          onBack={onBack}
          onNext={() => {
            onNext(code);
          }}
          nextButtonText={nextButtonText}
          disableNext={!isCodeValid}
        />
      </div>
    </div>
  );
}
