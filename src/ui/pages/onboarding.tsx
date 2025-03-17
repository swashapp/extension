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

import { BaseError } from "@/base-error";
import { VerificationActionType, VerificationType } from "@/enums/api.enum";
import { SystemMessage } from "@/enums/message.enum";
import { OnboardingFlows, OnboardingPages } from "@/enums/onboarding.enum";
import { helper } from "@/helper";
import { WEBSITE_URLs } from "@/paths";
import { AccountInfoRes } from "@/types/api/account.type";
import { MultiPageRef } from "@/types/ui.type";
import { GrantPermissionAlert } from "@/ui/components/grant-permission/grant-permission-alert";
import { MultiPageView } from "@/ui/components/multi-page-view/multi-page-view";
import { OnboardingCheckEmail } from "@/ui/components/onboarding/onboarding-check-email";
import { OnboardingCompleted } from "@/ui/components/onboarding/onboarding-completed";
import { OnboardingPrivacyPolicy } from "@/ui/components/onboarding/onboarding-privacy-policy";
import { OnboardingRecaptcha } from "@/ui/components/onboarding/onboarding-recaptcha";
import { OnboardingReferralCode } from "@/ui/components/onboarding/onboarding-referral-code";
import { OnboardingResetPasswordEmail } from "@/ui/components/onboarding/onboarding-reset-password-email";
import { OnboardingResetPasswordNotice } from "@/ui/components/onboarding/onboarding-reset-password-notice";
import { OnboardingRestoreBackup } from "@/ui/components/onboarding/onboarding-restore-backup";
import { OnboardingRestoreOptions } from "@/ui/components/onboarding/onboarding-restore-options";
import { OnboardingSetPassword } from "@/ui/components/onboarding/onboarding-set-password";
import { OnboardingSetupAccountNotice } from "@/ui/components/onboarding/onboarding-setup-account-notice";
import { OnboardingVerifyCode } from "@/ui/components/onboarding/onboarding-verify-code";
import { OnboardingWaitForDone } from "@/ui/components/onboarding/onboarding-wait-for-done";
import { OnboardingWelcome } from "@/ui/components/onboarding/onboarding-welcome";
import { showPopup } from "@/ui/components/popup/popup";
import { SwashLogo } from "@/ui/components/swash-logo/swash-logo";
import { toastMessage } from "@/ui/components/toast/toast-message";
import { OnboardingContext } from "@/ui/context/onboarding.context";
import { padWithZero } from "@/utils/string.util";

import styles from "./onboarding.module.css";

const RegisterBaseFlow = [
  OnboardingPages.PRIVACY_POLICY,
  OnboardingPages.CHECK_EMAIL,
  OnboardingPages.SET_PASSWORD,
  OnboardingPages.RECAPTCHA,
  OnboardingPages.SEND_EMAIL,
  OnboardingPages.REFERRAL_CODE,
  OnboardingPages.VERIFY_CODE,
  OnboardingPages.REGISTER,
  OnboardingPages.COMPLETED,
];

export function Onboarding(): ReactNode {
  const ref = useRef<MultiPageRef>();
  const [flow, setFlow] = useState<OnboardingFlows>(OnboardingFlows.LOGIN);

  const [page, setPage] = useState<number>(0);
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [requestId, setRequestId] = useState<string>("");
  const [challenge, setChallenge] = useState<string>("");
  const [referral, setReferral] = useState<string>("");
  const [code, setCode] = useState<string>("");

  const resetRequestId = useCallback(async () => {
    const { request_id } = await helper("user").resetVerify(
      VerificationType.EMAIL,
      requestId,
    );
    setRequestId(request_id);
  }, [requestId]);

  const verifyEmail = useCallback(async () => {
    let action: VerificationActionType;
    switch (flow) {
      case OnboardingFlows.REGISTER:
        action = VerificationActionType.REGISTER;
        break;
      case OnboardingFlows.RESET_PASSWORD:
        action = VerificationActionType.RESET_WALLET;
        break;
      default:
        action = VerificationActionType.REGISTER;
    }

    if (challenge) {
      const verify = await helper("user").verify(
        action,
        challenge,
        VerificationType.EMAIL,
        email,
      );
      setRequestId(verify.request_id);
    } else throw new BaseError(SystemMessage.NOT_ALLOWED_EMPTY_CHALLENGE);
  }, [challenge, email, flow]);

  const registerAccount = useCallback(async () => {
    await helper("user").register(email, password, referral, requestId, code);
  }, [code, email, password, referral, requestId]);

  const getEncryptedData = useCallback(async () => {
    await helper("user").getEncryptedData(email, password);
  }, [email, password]);

  const login = useCallback(async () => {
    await helper("user").login();
  }, []);

  const resetWallet = useCallback(async () => {
    await helper("user").resetWallet(email, password, requestId, code);
  }, [code, email, password, requestId]);

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
        case OnboardingPages.WELCOME:
          return <OnboardingWelcome />;
        case OnboardingPages.PRIVACY_POLICY:
          return <OnboardingPrivacyPolicy />;
        case OnboardingPages.CHECK_EMAIL:
          return <OnboardingCheckEmail />;
        case OnboardingPages.SET_PASSWORD:
          return <OnboardingSetPassword />;
        case OnboardingPages.RECAPTCHA:
          return <OnboardingRecaptcha />;
        case OnboardingPages.SEND_EMAIL:
          return <OnboardingWaitForDone action={verifyEmail} />;
        case OnboardingPages.REFERRAL_CODE:
          return <OnboardingReferralCode />;
        case OnboardingPages.VERIFY_CODE:
          return <OnboardingVerifyCode />;
        case OnboardingPages.REGISTER:
          return (
            <OnboardingWaitForDone
              action={async () => {
                await registerAccount();
                await login();
              }}
            />
          );
        case OnboardingPages.LOGIN_WITH_USER_PASS:
          return (
            <OnboardingWaitForDone
              action={async () => {
                await getEncryptedData();
                await login();
              }}
            />
          );
        case OnboardingPages.RESTORE_OPTIONS:
          return <OnboardingRestoreOptions />;
        case OnboardingPages.RESTORE_BACKUP:
          return <OnboardingRestoreBackup />;
        case OnboardingPages.LOGIN_WITH_WALLET:
          return (
            <OnboardingWaitForDone
              action={async () => {
                await login();
              }}
            />
          );
        case OnboardingPages.RESET_PASSWORD_NOTICE:
          return <OnboardingResetPasswordNotice />;
        case OnboardingPages.RESET_PASSWORD_EMAIL:
          return <OnboardingResetPasswordEmail />;
        case OnboardingPages.SETUP_ACCOUNT_NOTICE:
          return <OnboardingSetupAccountNotice />;
        case OnboardingPages.RESET_PASSWORD:
          return (
            <OnboardingWaitForDone
              action={async () => {
                await resetWallet();
                toastMessage(
                  "success",
                  SystemMessage.SUCCESSFULLY_RESET_PASSWORD,
                );
                await login();
              }}
            />
          );
        case OnboardingPages.COMPLETED:
          return <OnboardingCompleted />;
        default:
          return null;
      }
    },
    [getEncryptedData, login, registerAccount, resetWallet, verifyEmail],
  );

  const pages = useMemo(() => {
    switch (flow) {
      case OnboardingFlows.REGISTER:
        return [OnboardingPages.WELCOME, ...RegisterBaseFlow];
      case OnboardingFlows.LOGIN:
        return [
          OnboardingPages.WELCOME,
          OnboardingPages.LOGIN_WITH_USER_PASS,
          OnboardingPages.COMPLETED,
        ];
      case OnboardingFlows.RESTORE_BACKUP:
        return [
          OnboardingPages.WELCOME,
          OnboardingPages.RESTORE_OPTIONS,
          OnboardingPages.RESTORE_BACKUP,
          OnboardingPages.LOGIN_WITH_WALLET,
          OnboardingPages.COMPLETED,
        ];
      case OnboardingFlows.RESET_PASSWORD:
        return [
          OnboardingPages.WELCOME,
          OnboardingPages.RESTORE_OPTIONS,
          OnboardingPages.RESET_PASSWORD_NOTICE,
          OnboardingPages.RESET_PASSWORD_EMAIL,
          OnboardingPages.RECAPTCHA,
          OnboardingPages.SEND_EMAIL,
          OnboardingPages.SET_PASSWORD,
          OnboardingPages.VERIFY_CODE,
          OnboardingPages.RESET_PASSWORD,
          OnboardingPages.COMPLETED,
        ];
      case OnboardingFlows.SETUP_ACCOUNT:
        return [
          OnboardingPages.WELCOME,
          OnboardingPages.RESTORE_OPTIONS,
          OnboardingPages.SETUP_ACCOUNT_NOTICE,
          ...RegisterBaseFlow,
        ];
      default:
        return [];
    }
  }, [flow]);

  return (
    <OnboardingContext.Provider
      value={{
        flow,
        email,
        password,
        requestId,
        challenge,
        referral,
        code,

        setFlow,
        setEmail: useCallback(async (email) => {
          setEmail(email.trim());
          await helper("cache").setTempEmail(email);
        }, []),
        setPassword,
        setRequestId,
        setChallenge,
        setReferral,
        setDeviceKey: useCallback(async (deviceKey) => {
          if (deviceKey)
            await helper("cache").setDeviceKey(deviceKey.trim().toLowerCase());
        }, []),
        setCode,
        resetRequestId,

        next: (page = 1) => ref.current?.next(page),
        back: (page = 1) => ref.current?.back(page),
      }}
    >
      <div className={styles.container}>
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
            <p className={clsx("text-center", styles.footer)}>
              This site is protected by reCAPTCHA and the{" "}
              <a
                href={WEBSITE_URLs.privacy}
                target={"_blank"}
                rel={"noreferrer"}
              >
                Swash Privacy Policy
              </a>{" "}
              and{" "}
              <a href={WEBSITE_URLs.terms} target={"_blank"} rel={"noreferrer"}>
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
