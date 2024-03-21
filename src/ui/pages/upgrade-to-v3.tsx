import clsx from "clsx";
import {
  ReactNode,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";

import { AppStages } from "@/enums/app.enum";
import { ButtonColors } from "@/enums/button.enum";
import { SystemMessage } from "@/enums/message.enum";
import { helper } from "@/helper";
import { DASHBOARD_PATHS, WEBSITE_URLs } from "@/paths";
import { MultiPageRef } from "@/types/ui.type";
import { Button } from "@/ui/components/button/button";
import { Checkbox } from "@/ui/components/checkbox/checkbox";
import { InputBase } from "@/ui/components/input/input-base";
import { Link } from "@/ui/components/link/link";
import { MultiPageView } from "@/ui/components/multi-page-view/multi-page-view";
import { NavigationButtons } from "@/ui/components/navigation-buttons/navigation-buttons";
import { closePopup, showPopup } from "@/ui/components/popup/popup";
import { toastMessage } from "@/ui/components/toast/toast-message";
import { DashboardContext } from "@/ui/context/dashboard.context";
import { useErrorHandler } from "@/ui/hooks/use-error-handler";
import { EarnMore } from "@/ui/pages/earn-more";
import { isValidPassword } from "@/utils/validator.util";

import styles from "./upgrade-to-v3.module.css";

function UpgradePopup({
  onMigrate,
}: {
  onMigrate: (path?: string) => void;
}): ReactNode {
  const ref = useRef<MultiPageRef>();
  const { safeRun } = useErrorHandler();

  const [loading, setLoading] = useState<boolean>(false);
  const [email, setEmail] = useState<string>("");
  const [masterPass, setMasterPass] = useState<string>("");
  const [confirmMasterPass, setConfirmMasterPass] = useState<string>("");
  const [check1, setCheck1] = useState<boolean>(false);

  const [balance, setBalance] = useState<string>("");
  const [withdrawn, setWithdrawn] = useState<string>("");

  const isPasswordValid = useMemo(
    () => masterPass === confirmMasterPass && isValidPassword(masterPass),
    [masterPass, confirmMasterPass],
  );

  const migrate = useCallback(async () => {
    safeRun(
      async () => {
        setLoading(true);
        if (isPasswordValid && email) {
          await helper("user").migrate(email, masterPass);
          await helper("user").login();

          if (balance && withdrawn)
            helper("user").merge(balance, withdrawn).then();

          ref.current?.next();
        }
      },
      {
        finally: () => {
          setLoading(false);
        },
      },
    );
  }, [balance, email, isPasswordValid, masterPass, safeRun, withdrawn]);

  useEffect(() => {
    safeRun(
      async () => {
        setLoading(true);
        const { migratable, email, ...rest } =
          await helper("user").getMigrationStatus();
        setEmail(email);

        if (!migratable) {
          await helper("wallet").assign({});
          await helper("cache").setTempEmail(email);
          await helper("coordinator").set("stage", AppStages.ONBOARDING);
          onMigrate(DASHBOARD_PATHS.onboarding);
        } else if (rest.mergeable) {
          const { balance, withdrawn } = rest;

          setBalance(balance);
          setWithdrawn(withdrawn);
        }
        setLoading(false);
      },
      {
        failure: () => {
          toastMessage("error", SystemMessage.FAILED_MIGRATION_STATUS);
        },
      },
    );
  }, [onMigrate, safeRun]);

  return (
    <div className={styles.popup}>
      <MultiPageView ref={ref}>
        <div className={clsx("flex col center gap40", styles.welcome)}>
          <img
            src={"/images/misc/token-galaxy.webp"}
            alt={"Token galaxy"}
            className={styles.galaxy}
          />
          <div className={"flex col center gap12"}>
            <p className={"larger bold text-center"}>
              Upgrade to the latest version
            </p>
            <p className={clsx("text-center", styles.text)}>
              Upgrade for new withdrawal methods, proportional earnings, a new
              referral system, and an easier way to manage your account.{" "}
              <Link
                className={styles.link}
                url={WEBSITE_URLs.v3_upgrade_blog}
                newTab={true}
              >
                Read more about it here.
              </Link>
            </p>
          </div>
          <Button
            text={`Take me to V3`}
            color={ButtonColors.PRIMARY}
            className={"full-width-button"}
            loading={loading}
            onClick={() => {
              ref.current?.next();
            }}
          />
        </div>
        <div className={clsx("flex col gap32", styles.password)}>
          <h6>Create your master password</h6>
          <p>
            Your master password will allow you to enter your Swash account on
            multiple devices. Store it in a safe place and keep it to yourself
            to maintain your security.
          </p>
          <div className={"flex col gap16"}>
            <InputBase
              type={"password"}
              name={"password"}
              placeholder={"Enter your master password"}
              value={masterPass}
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
          <div className={"flex align-center gap8"}>
            <Checkbox
              checked={check1}
              onChange={() => {
                setCheck1(!check1);
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
            onBack={() => ref.current?.back()}
            onNext={async () => {
              await migrate();
            }}
            nextButtonText={"Set password"}
            loading={loading}
            disableNext={loading || !isPasswordValid || !check1}
          />
        </div>
        <div className={clsx("flex col center gap40", styles.welcome)}>
          <img
            src={"/images/misc/thumbs-up.webp"}
            alt={"Thumbs up"}
            className={styles.thumbs}
          />
          <div className={"flex col center gap12"}>
            <p className={"larger bold text-center"}>
              Congrats, you have successfully
              <br />
              set up your account for Swash V3!
            </p>
          </div>
          <Button
            text={`Use Swash`}
            color={ButtonColors.PRIMARY}
            className={"normal-button"}
            onClick={async () => {
              await helper("coordinator").set("isActive", true);
              onMigrate(DASHBOARD_PATHS.profile);
            }}
          />
        </div>
      </MultiPageView>
    </div>
  );
}

export function UpgradeToV3(): ReactNode {
  const { update } = useContext(DashboardContext);

  const onMigrate = useCallback(
    async (path?: string) => {
      await update(path);
      closePopup();
    },
    [update],
  );

  useEffect(() => {
    showPopup({
      closable: false,
      closeOnBackDropClick: false,
      size: "custom",
      content: <UpgradePopup onMigrate={onMigrate} />,
    });
  });

  return <EarnMore />;
}
