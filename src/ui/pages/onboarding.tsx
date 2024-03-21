import { MobileStepper } from "@mui/material";
import clsx from "clsx";
import {
  ReactNode,
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";

import { VerificationActionType, VerificationType } from "@/enums/api.enum";
import { OnboardingFlows, OnboardingPages } from "@/enums/onboarding.enum";
import { helper } from "@/helper";
import { WebsiteURLs } from "@/paths";
import { AccountInfoRes } from "@/types/api/account.type";
import { MultiPageRef } from "@/types/ui.type";
import { padWithZero } from "@/utils/string.util";

import { GrantPermissionAlert } from "../components/grant-permission/grant-permission-alert";
import { MultiPageView } from "../components/multi-page-view/multi-page-view";
import { OnboardingCheckEmail } from "../components/onboarding/onboarding-check-email";
import { OnboardingCompleted } from "../components/onboarding/onboarding-completed";
import { OnboardingPrivacyPolicy } from "../components/onboarding/onboarding-privacy-policy";
import { OnboardingRecaptcha } from "../components/onboarding/onboarding-recaptcha";
import { OnboardingResetPassword } from "../components/onboarding/onboarding-reset-password";
import { OnboardingRestoreBackup } from "../components/onboarding/onboarding-restore-backup";
import { OnboardingSetPassword } from "../components/onboarding/onboarding-set-password";
import { OnboardingVerifyCode } from "../components/onboarding/onboarding-verify-code";
import { OnboardingWaitForDone } from "../components/onboarding/onboarding-wait-for-done";
import { OnboardingWelcome } from "../components/onboarding/onboarding-welcome";
import { showPopup } from "../components/popup/popup";
import { SwashLogo } from "../components/swash-logo/swash-logo";
import { OnboardingContext } from "../context/onboarding.context";

import styles from "./onboarding.module.css";

export function Onboarding(): ReactNode {
  const ref = useRef<MultiPageRef>();
  const [flow, setFlow] = useState<OnboardingFlows>(OnboardingFlows.Login);

  const [page, setPage] = useState<number>(0);
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [requestId, setRequestId] = useState<string>("");
  const [challenge, setChallenge] = useState<string>("");
  const [code, setCode] = useState<string>("");

  const verifyEmail = useCallback(async () => {
    let action: VerificationActionType;
    switch (flow) {
      case OnboardingFlows.Login:
        action = VerificationActionType.LOGIN;
        break;
      case OnboardingFlows.ResetPassword:
        action = VerificationActionType.RESET_PASSWORD;
        break;
      case OnboardingFlows.RestoreBackup:
        action = VerificationActionType.LOGIN;
        break;
      default:
        action = VerificationActionType.REGISTER;
    }

    if (challenge) {
      const verify = await helper("user").verify(
        VerificationType.EMAIL,
        action,
        email,
        challenge,
      );
      setRequestId(verify.request_id);
    }
  }, [challenge, email, flow]);

  const registerAccount = useCallback(async () => {
    await helper("user").register(email, password, requestId, code);
  }, [code, email, password, requestId]);

  const getEncryptedData = useCallback(async () => {
    await helper("user").getEncryptedData(email, password);
  }, [email, password]);

  const login = useCallback(async () => {
    await helper("user").login();
  }, []);

  useEffect(() => {
    const updateEmail = async () => {
      const cache = helper("cache");
      if (email) {
        await cache.setTempEmail(email);
      } else {
        const { email: _email } = (await cache.getData(
          "account",
        )) as AccountInfoRes;
        if (_email) setEmail(_email);
      }
    };
    updateEmail().then();
  }, [email]);

  useEffect(() => {
    showPopup({
      closable: false,
      closeOnBackDropClick: false,
      size: "small",
      content: <GrantPermissionAlert />,
    });
  }, []);

  const OnboardingStep = useCallback(
    (props: { page: OnboardingPages }) => {
      switch (props.page) {
        case OnboardingPages.Welcome:
          return <OnboardingWelcome />;
        case OnboardingPages.PrivacyPolicy:
          return <OnboardingPrivacyPolicy />;
        case OnboardingPages.CheckEmail:
          return <OnboardingCheckEmail />;
        case OnboardingPages.SetPassword:
          return <OnboardingSetPassword />;
        case OnboardingPages.Recaptcha:
          return <OnboardingRecaptcha />;
        case OnboardingPages.SendEmail:
          return <OnboardingWaitForDone action={verifyEmail} />;
        case OnboardingPages.VerifyCode:
          return <OnboardingVerifyCode />;
        case OnboardingPages.Register:
          return <OnboardingWaitForDone action={registerAccount} />;
        case OnboardingPages.LoginWithUserPass:
          return (
            <OnboardingWaitForDone
              action={async () => {
                await getEncryptedData();
                await login();
              }}
            />
          );
        case OnboardingPages.RestoreBackup:
          return <OnboardingRestoreBackup />;
        case OnboardingPages.LoginWithWallet:
          return (
            <OnboardingWaitForDone
              action={async () => {
                await login();
              }}
            />
          );
        case OnboardingPages.ResetPassword:
          return <OnboardingResetPassword />;
        case OnboardingPages.Completed:
          return <OnboardingCompleted />;
        default:
          return null;
      }
    },
    [getEncryptedData, login, registerAccount, verifyEmail],
  );

  const pages = useMemo(() => {
    if (flow === OnboardingFlows.Login)
      return [
        OnboardingPages.Welcome,
        OnboardingPages.LoginWithUserPass,
        OnboardingPages.Completed,
      ];
    else if (flow === OnboardingFlows.RestoreBackup)
      return [
        OnboardingPages.Welcome,
        OnboardingPages.RestoreBackup,
        OnboardingPages.LoginWithWallet,
        OnboardingPages.Completed,
      ];
    else if (flow === OnboardingFlows.ResetPassword)
      return [
        OnboardingPages.Welcome,
        OnboardingPages.ResetPassword,
        OnboardingPages.Welcome,
      ];
    return [
      OnboardingPages.Welcome,
      OnboardingPages.PrivacyPolicy,
      OnboardingPages.CheckEmail,
      OnboardingPages.SetPassword,
      OnboardingPages.Recaptcha,
      OnboardingPages.SendEmail,
      OnboardingPages.VerifyCode,
      OnboardingPages.Register,
      OnboardingPages.Completed,
    ];
  }, [flow]);

  return (
    <OnboardingContext.Provider
      value={{
        flow,
        email,
        password,
        requestId,
        challenge,
        code,

        setFlow,
        setEmail: useCallback(async (email) => {
          setEmail(email.trim());
          await helper("cache").setTempEmail(email);
        }, []),
        setPassword,
        setRequestId,
        setChallenge,
        setCode,

        next: (page = 1) => ref.current?.next(page),
        back: (page = 1) => ref.current?.back(page),
      }}
    >
      <div className={clsx("no-overflow", styles.container)}>
        <div className={clsx("flex col", styles.stepper)}>
          <div
            className={clsx("flex justify-between border-box", styles.boxing)}
          >
            <SwashLogo />
            <div className={clsx("flex align-center", styles.progress)}>
              <p className={"smaller bold"}>{padWithZero(page)}</p>
              <MobileStepper
                className={clsx("border-box", styles.bar)}
                variant={"progress"}
                steps={pages.length}
                position={"static"}
                activeStep={page}
                nextButton={null}
                backButton={null}
                LinearProgressProps={{
                  className: styles.line,
                }}
              />
              <p className={"smaller bold"}>{padWithZero(pages.length)}</p>
            </div>
          </div>
          <div className={clsx("flex col center", styles.swiper)}>
            <MultiPageView ref={ref} onChange={setPage}>
              {pages.map((page: OnboardingPages, index: number) => (
                <div key={`page-${index}`} className={styles.card}>
                  <OnboardingStep key={page} page={page} />
                </div>
              ))}
            </MultiPageView>
          </div>
          <div
            className={clsx("flex justify-center border-box", styles.boxing)}
          >
            <p className={styles.footer}>
              This site is protected by reCAPTCHA and the{" "}
              <a
                href={WebsiteURLs.privacy}
                target={"_blank"}
                rel={"noreferrer"}
              >
                Swash Privacy Policy
              </a>{" "}
              and{" "}
              <a href={WebsiteURLs.terms} target={"_blank"} rel={"noreferrer"}>
                Terms of Use
              </a>{" "}
              apply.
            </p>
          </div>
        </div>
      </div>
    </OnboardingContext.Provider>
  );
}
