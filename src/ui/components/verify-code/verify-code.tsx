import clsx from "clsx";
import { ReactNode, useCallback, useMemo, useState } from "react";

import { Countdown } from "@/ui/components/countdown/countdown";
import { InputBase } from "@/ui/components/input/input-base";
import { NavigationButtons } from "@/ui/components/navigation-buttons/navigation-buttons";
import { useErrorHandler } from "@/ui/hooks/use-error-handler";

import styles from "./verify-code.module.css";

export function VerifyCode({
  className = "",
  text,
  nextButtonText,
  onBack,
  onNext,
  onResetCountdown,
}: {
  className?: string;
  text: string;
  nextButtonText: string;
  onBack: () => void;
  onNext: (code: string) => void;
  onResetCountdown?: () => void | Promise<void>;
}): ReactNode {
  const { safeRun } = useErrorHandler();

  const [loading, setLoading] = useState(false);
  const [code, setCode] = useState("");
  const [over, setOver] = useState(false);

  const isCodeValid = useMemo(() => code.length >= 6, [code.length]);

  const onOver = useCallback(() => {
    setOver(true);
  }, []);

  const onRetry = useCallback(async () => {
    setLoading(true);
    safeRun(
      async () => {
        onResetCountdown && (await onResetCountdown());
        setOver(false);
      },
      { finally: () => setLoading(false) },
    );
  }, [onResetCountdown, safeRun]);

  return (
    <div className={clsx("flex col gap40", styles.container)}>
      <h6>Check your {text.includes("@") ? "email" : "phone"}</h6>
      <div className={clsx("flex col gap40", className)}>
        <p>
          We have sent {text} a verification code. Please enter the code you
          received below to proceed with the verification process.
        </p>
        <div className={"flex col gap12"}>
          <InputBase
            type={"text"}
            name={"code"}
            placeholder={"Enter your verification code"}
            value={code}
            autoFocus={true}
            onChange={(e) => {
              const { value } = e.target;
              const numericValue = value.replace(/[^0-9]/g, "");
              setCode(numericValue);
            }}
          />
          <p>
            Didn&apos;t receive a code?{" "}
            <span className={styles.countdown}>
              {over ? (
                loading ? (
                  <span className={"bold"}>Sending...</span>
                ) : (
                  <span className={"bold pointer"} onClick={onRetry}>
                    Send me a new code
                  </span>
                )
              ) : (
                <span className={"bold"}>
                  Resend code in{" "}
                  <Countdown
                    minutes={2}
                    seconds={0}
                    className={"bold"}
                    onOver={onOver}
                  />
                </span>
              )}
            </span>
          </p>
        </div>
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
