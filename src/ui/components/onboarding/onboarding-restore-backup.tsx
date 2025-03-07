import clsx from "clsx";
import { ReactNode, useCallback, useContext } from "react";

import { helper } from "@/helper";
import { SUPPORT_URLS } from "@/paths";
import { RestoreMenu } from "@/ui/components/backup-restore/restore-menu";
import { BackButton } from "@/ui/components/button/back";
import { OnboardingPage } from "@/ui/components/onboarding/onboarding-page";
import { closePopup } from "@/ui/components/popup/popup";
import { OnboardingContext } from "@/ui/context/onboarding.context";
import { useErrorHandler } from "@/ui/hooks/use-error-handler";
import InfoIcon from "~/images/icons/hexagon-info.svg?react";

import styles from "./onboarding-restore-backup.module.css";

export function OnboardingRestoreBackup(): ReactNode {
  const { safeRun } = useErrorHandler();
  const { back, next } = useContext(OnboardingContext);

  const onPrivateKey = useCallback(
    (privateKey: string) => {
      safeRun(async () => {
        await helper("restore").withPrivateKey(privateKey);
        closePopup();
        next();
      });
    },
    [next, safeRun],
  );

  const onBackupFile = useCallback(
    (backup: string) => {
      safeRun(async () => {
        await helper("restore").fromBackup(backup);
        next();
      });
    },
    [next, safeRun],
  );

  return (
    <OnboardingPage
      title={"Restore backup file"}
      navigation={
        <BackButton
          text={"Go back to restore options"}
          onClick={() => back()}
        />
      }
    >
      <div className={"flex col gap20"}>
        <p>
          If you can no longer access the email you used to sign up to Swash,
          unfortunately <span className={"bold"}>you can’t reset it</span> by
          adding a new email.
        </p>
        <p>
          But, don’t worry! If you’ve backed up your account, you can log in
          with one of the options below:
        </p>
      </div>
      <div
        className={clsx("bg-pink flex gap8 align-center round", styles.error)}
      >
        <InfoIcon />
        <p className={"small"}>
          If you had an account before February 13, 2025, please register and
          merge your old account via extension settings.
        </p>
      </div>
      <div className={"flex col gap24"}>
        <RestoreMenu onPrivateKey={onPrivateKey} onBackupFile={onBackupFile} />
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
