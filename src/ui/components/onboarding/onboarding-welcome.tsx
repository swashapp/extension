import clsx from "clsx";
import { ReactNode, useCallback, useContext, useState } from "react";

import { ButtonColors } from "@/enums/button.enum";
import { OnboardingFlows } from "@/enums/onboarding.enum";
import { Button } from "@/ui/components/button/button";
import { InputBase } from "@/ui/components/input/input-base";
import { OnboardingPage } from "@/ui/components/onboarding/onboarding-page";
import { OnboardingContext } from "@/ui/context/onboarding.context";
import { isValidEmail, isValidPassword } from "@/utils/validator.util";
import NextIcon from "~/images/icons/arrow-1.svg?react";
import InfoIcon from "~/images/icons/hexagon-info.svg?react";

import styles from "./onboarding-welcome.module.css";

export function OnboardingWelcome(): ReactNode {
  const {
    email: contextEmail,
    setFlow,
    setEmail: contextSetEmail,
    setPassword,
    next,
  } = useContext(OnboardingContext);

  const [email, setEmail] = useState<string>(contextEmail);
  const [masterPass, setMasterPass] = useState<string>("");
  const [error, setError] = useState<boolean>(false);

  const login = useCallback(() => {
    if (error || !isValidPassword(masterPass)) return;

    setFlow(OnboardingFlows.LOGIN);
    contextSetEmail(email);
    setPassword(masterPass);
    next();
  }, [contextSetEmail, email, error, masterPass, next, setFlow, setPassword]);

  return (
    <OnboardingPage>
      <div className={"flex center"}>
        <img
          src={"/images/misc/wave-hand.webp"}
          alt={"wave-hand"}
          width={172}
          height={160}
        />
      </div>
      <div className={"flex col align-center gap12"}>
        <h6>Welcome back!</h6>
        <p>Log in to your Swash account.</p>
      </div>
      <div className={"flex col gap24"}>
        <div className={"flex col gap12"}>
          <InputBase
            type={"email"}
            name={"email"}
            placeholder={"example@email.com"}
            value={email}
            error={error}
            autoFocus={true}
            onBlur={() => {
              setError(!isValidEmail(email));
            }}
            onChange={(e) => {
              setEmail(e.target.value);
            }}
          />
        </div>
        <div className={"flex col gap12"}>
          <InputBase
            type={"password"}
            name={"password"}
            placeholder={"Enter your password"}
            value={masterPass}
            onChange={(e) => {
              setMasterPass(e.target.value);
            }}
            onKeyDown={(e) => {
              if (e.key === "Enter") login();
            }}
          />
        </div>
        <div className={"flex col gap12"}>
          <Button
            text={"Login"}
            className={"full-width-button"}
            color={ButtonColors.PRIMARY}
            disabled={error || !isValidPassword(masterPass)}
            onClick={() => {
              login();
            }}
          />
          <p className={"text-center"}>
            <span className={"bold"}>
              <a
                onClick={() => {
                  setFlow(OnboardingFlows.RESTORE_BACKUP);
                  contextSetEmail(email);
                  next();
                }}
              >
                Forgot my credentials
              </a>
            </span>
          </p>
          <p className={"text-center"}>
            Don’t have an account?{" "}
            <span className={"bold"}>
              <a
                onClick={() => {
                  setFlow(OnboardingFlows.REGISTER);
                  contextSetEmail(email);
                  next();
                }}
              >
                Sign up
              </a>
            </span>
          </p>
        </div>
      </div>
      <div
        className={clsx(
          "flex justify-between align-center round",
          styles.notice,
        )}
      >
        <div className={"flex row align-start gap8"}>
          <InfoIcon className={styles.info} />
          <p>
            Did you register for Swash before 13.02.2025?
            <br />
            <a
              onClick={() => {
                setFlow(OnboardingFlows.REGISTER);
                contextSetEmail(email);
                next();
              }}
            >
              Sign up
            </a>{" "}
            for the new version instead
          </p>
        </div>
        <NextIcon className={clsx("rotate90", styles.next)} />
      </div>
    </OnboardingPage>
  );
}
