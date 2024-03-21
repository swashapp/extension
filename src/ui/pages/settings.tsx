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
import CopyToClipboard from "react-copy-to-clipboard";
import QRCode from "react-qr-code";

import { VerificationActionType, VerificationType } from "@/enums/api.enum";
import { ButtonColors } from "@/enums/button.enum";
import { CloudServices } from "@/enums/cloud.enum";
import { SystemMessage } from "@/enums/message.enum";
import { helper } from "@/helper";
import { InternalRoutes, WebsiteURLs } from "@/paths";
import { GetIpLocationRes } from "@/types/api/ip.type";
import { MultiPageRef } from "@/types/ui.type";
import { PhoneInput } from "@/ui/components/input/phone-input";
import { isValidPassword, isValidPhoneNumber } from "@/utils/validator.util";

import { BackupOption } from "../components/backup-option/backup-option";
import { Button } from "../components/button/button";
import { TextEndAdornment } from "../components/input/end-adornments/text-end-adornment";
import { Input } from "../components/input/input";
import { MultiPageView } from "../components/multi-page-view/multi-page-view";
import { MultiTabView } from "../components/multi-tab-view/multi-tab-view";
import { PageHeader } from "../components/page-header/page-header";
import { closePopup, showPopup } from "../components/popup/popup";
import { WaitingProgressBar } from "../components/progress/waiting-progress";
import { Recaptcha } from "../components/recaptcha/recaptcha";
import { toastMessage } from "../components/toast/toast-message";
import { VerifyCode } from "../components/verify-code/verify-code";
import { WaitForDone } from "../components/wait-for-done/wait-for-done";
import { DashboardContext } from "../context/dashboard.context";
import { useErrorHandler } from "../hooks/use-error-handler";

import styles from "./settings.module.css";

function SetPassword({ password }: { password: string }) {
  const ref = useRef<MultiPageRef>();
  const { safeRun } = useErrorHandler();
  const { account } = useContext(DashboardContext);

  const [challenge, setChallenge] = useState<string>("");
  const [requestId, setRequestId] = useState<string>("");
  const [code, setCode] = useState<string>("");

  return (
    <MultiPageView ref={ref}>
      <Recaptcha
        onBack={() => {
          closePopup();
        }}
        onTokenReceived={(token: string) => {
          setChallenge(token);
          ref.current?.next();
        }}
      />
      <WaitForDone
        onBack={() => {
          setChallenge("");
          setRequestId("");
          ref.current?.back();
        }}
        onLoad={() => {
          safeRun(async () => {
            const verify = await helper("user").verify(
              VerificationType.EMAIL,
              VerificationActionType.RESET_PASSWORD,
              account.email,
              challenge,
            );
            setRequestId(verify.request_id);
            ref.current?.next();
          });
        }}
      />
      <VerifyCode
        text={account.email}
        onBack={() => {
          setChallenge("");
          setRequestId("");
          setCode("");
          ref.current?.back(2);
        }}
        onNext={async (code) => {
          setCode(code);
          ref.current?.next();
        }}
        nextButtonText={"Set password"}
      />
      <WaitForDone
        onBack={() => {
          setChallenge("");
          setRequestId("");
          setCode("");
          ref.current?.back(3);
        }}
        onLoad={async () => {
          safeRun(
            async () => {
              await helper("user").resetPassword(
                account.email,
                password,
                requestId,
                code,
              );
              toastMessage("success", SystemMessage.SUCCESSFULLY_SET_PASSWORD);
              closePopup();
            },
            {
              failure: async () => {
                toastMessage("error", SystemMessage.FAILED_SET_PASSWORD);
              },
            },
          );
        }}
      />
    </MultiPageView>
  );
}

function VerifyMobile({ phone }: { phone: string }) {
  const ref = useRef<MultiPageRef>();
  const { safeRun } = useErrorHandler();
  const { update } = useContext(DashboardContext);

  const [challenge, setChallenge] = useState<string>("");
  const [requestId, setRequestId] = useState<string>("");
  const [code, setCode] = useState<string>("");

  return (
    <MultiPageView ref={ref}>
      <Recaptcha
        onBack={() => {
          setChallenge("");
          ref.current?.back();
        }}
        onTokenReceived={(token: string) => {
          setChallenge(token);
          ref.current?.next();
        }}
      />
      <WaitForDone
        onBack={() => {
          setChallenge("");
          setRequestId("");
          ref.current?.back();
        }}
        onLoad={() => {
          safeRun(async () => {
            const verify = await helper("user").verify(
              VerificationType.PHONE,
              VerificationActionType.INFO,
              phone,
              challenge,
            );
            setRequestId(verify.request_id);
            ref.current?.next();
          });
        }}
      />
      <VerifyCode
        text={phone}
        onBack={() => {
          setChallenge("");
          setRequestId("");
          setCode("");
          ref.current?.back(2);
        }}
        onNext={async (code) => {
          setCode(code);
          ref.current?.next();
        }}
        nextButtonText={"Verify"}
      />
      <WaitForDone
        onBack={() => {
          setChallenge("");
          setRequestId("");
          setCode("");
          ref.current?.back(3);
        }}
        onLoad={async () => {
          safeRun(
            async () => {
              await helper("user").updateVerifiedInfo(requestId, code);
              toastMessage(
                "success",
                SystemMessage.SUCCESSFULLY_UPDATED_PHONE_NUMBER,
              );
              update(true);
              closePopup();
            },
            {
              failure: async () => {
                toastMessage(
                  "error",
                  SystemMessage.FAILED_UPDATED_PHONE_NUMBER,
                );
              },
            },
          );
        }}
      />
    </MultiPageView>
  );
}

export function Settings(): ReactNode {
  const { safeRun } = useErrorHandler();
  const { account } = useContext(DashboardContext);

  const [phone, setPhone] = useState<string>("");
  const [phoneIsValid, setPhoneIsValid] = useState<boolean>(false);
  const [country, setCountry] = useState<string>("");
  const [edit, setEdit] = useState<boolean>(false);
  const [privateKey, setPrivateKey] = useState<string>("");
  const [masterPass, setMasterPass] = useState<string>("");
  const [confirmMasterPass, setConfirmMasterPass] = useState<string>("");

  const [loading, setLoading] = useState<string>("");

  const isPasswordValid = useMemo(
    () => masterPass === confirmMasterPass && isValidPassword(masterPass),
    [masterPass, confirmMasterPass],
  );

  const onSetPassword = useCallback(() => {
    if (isPasswordValid) {
      showPopup({
        closable: false,
        closeOnBackDropClick: true,
        size: "custom",
        content: <SetPassword password={masterPass} />,
      });
    }
  }, [isPasswordValid, masterPass]);

  useEffect(() => {
    if (!country)
      safeRun(async () => {
        const location = (await helper("cache").getData(
          "location",
        )) as GetIpLocationRes;
        setCountry(location.country_code);
      });
  }, [country, safeRun]);

  useEffect(() => {
    if (!privateKey)
      safeRun(async () => {
        setPrivateKey(await helper("wallet").get());
      });
  }, [privateKey, safeRun]);

  const tabs = useMemo(() => {
    return [
      {
        label: <p className={"bold"}>Your account settings</p>,
        content: (
          <div className={clsx("flex col gap32", styles.panel)}>
            <p>
              Don’t forget to download your settings to make sure you can access
              your account on other devices or browsers.
              <br />
              <br />
              If you lose access but don’t have this in a safe place, then you
              won’t be able to access your wallet. Think of this like a
              password. Do not share your private key or saved file with anyone
              and make sure to store it securely offline.
            </p>
            <div className={"flex gap12"}>
              <CopyToClipboard text={privateKey}>
                <BackupOption
                  text={"Copy private key"}
                  icon={"/images/icons/copy.svg"}
                  type={2}
                  onClick={() => {
                    toastMessage(
                      "success",
                      SystemMessage.SUCCESSFULLY_COPIED_PRIVATE_KEY,
                    );
                  }}
                />
              </CopyToClipboard>
              <BackupOption
                text={"Local File"}
                icon={"/images/icons/file.svg"}
                type={2}
                onClick={() => {
                  safeRun(async () => {
                    await helper("backup").download();
                    toastMessage(
                      "success",
                      SystemMessage.SUCCESSFULLY_CREATE_BACKUP_FILE,
                    );
                  });
                }}
              />
              <BackupOption
                text={"Dropbox"}
                icon={"/images/icons/logos/dropbox.svg"}
                type={2}
                loading={loading === "Dropbox"}
                onClick={() => {
                  safeRun(
                    async () => {
                      setLoading("Dropbox");
                      await helper("backup").uploadToCloud(
                        CloudServices.DROPBOX,
                      );
                      toastMessage(
                        "success",
                        SystemMessage.SUCCESSFULLY_UPLOAD_BACKUP_FILE,
                      );
                    },
                    {
                      failure: () => {
                        toastMessage(
                          "error",
                          SystemMessage.FAILED_UPLOAD_BACKUP_FILE,
                        );
                      },
                      finally: () => {
                        setLoading("");
                      },
                    },
                  );
                }}
              />
              <BackupOption
                text={"Google Drive"}
                icon={"/images/icons/logos/google-drive.svg"}
                type={2}
                loading={loading === "Google Drive"}
                imageSize={{ width: 27 }}
                onClick={() => {
                  safeRun(
                    async () => {
                      setLoading("Google Drive");
                      await helper("backup").uploadToCloud(
                        CloudServices.GOOGLE_DRIVE,
                      );
                      toastMessage(
                        "success",
                        SystemMessage.SUCCESSFULLY_UPLOAD_BACKUP_FILE,
                      );
                    },
                    {
                      failure: () => {
                        toastMessage(
                          "error",
                          SystemMessage.FAILED_UPLOAD_BACKUP_FILE,
                        );
                      },
                      finally: () => {
                        setLoading("");
                      },
                    },
                  );
                }}
              />
            </div>
          </div>
        ),
      },
      {
        label: <p className={"bold"}>Logging in</p>,
        content: (
          <div className={clsx("flex col gap32", styles.panel)}>
            <p>
              Logging in with the Swash mobile app? Scan the QR code below to
              sync your devices.
            </p>
            {privateKey ? (
              <QRCode value={privateKey} />
            ) : (
              <WaitingProgressBar />
            )}
          </div>
        ),
      },
      {
        label: <p className={"bold"}>Email + Password</p>,
        content: (
          <div className={clsx("flex col gap16", styles.panel)}>
            <Input label={"Email"} value={account.email} disabled />
            <Input
              type={"password"}
              label={"Master password"}
              placeholder={"Enter your master password"}
              value={masterPass}
              onChange={(e) => {
                setMasterPass(e.target.value);
              }}
            />
            <Input
              type={"password"}
              label={"Confirm master password"}
              placeholder={"Enter your master password again"}
              value={confirmMasterPass}
              onChange={(e) => {
                setConfirmMasterPass(e.target.value);
              }}
              onKeyUp={(e) => {
                if (e.key === "Enter") onSetPassword();
              }}
              endAdornment={
                <TextEndAdornment
                  text={"Update"}
                  disabled={!isPasswordValid}
                  onClick={() => {
                    onSetPassword();
                  }}
                />
              }
            />
          </div>
        ),
      },
      {
        label: <p className={"bold"}>Phone number</p>,
        content: (
          <div className={clsx("flex col gap32", styles.panel)}>
            <p>Please provide your phone number to verify your account</p>
            {!edit ? (
              <Input
                label={"Phone number"}
                value={account.phone}
                contentEditable={false}
                onClick={() => setEdit(true)}
              />
            ) : (
              <>
                <PhoneInput
                  label={"Phone number"}
                  value={phone}
                  country={country.toLocaleLowerCase()}
                  placeholder={account.phone}
                  onChange={(phone) => {
                    setPhone(`+${phone}`);
                    setPhoneIsValid(isValidPhoneNumber(phone));
                  }}
                />
                <div className={"flex"}>
                  <Button
                    text={"Send code"}
                    className={"normal-button"}
                    color={ButtonColors.PRIMARY}
                    disabled={!phoneIsValid}
                    onClick={() => {
                      showPopup({
                        closable: false,
                        closeOnBackDropClick: true,
                        size: "custom",
                        content: <VerifyMobile phone={phone} />,
                      });
                    }}
                  />
                </div>
              </>
            )}
          </div>
        ),
      },
      {
        label: <p className={"bold"}>Data & ads controls</p>,
        content: (
          <div className={clsx("flex col gap32", styles.panel)}>
            <p>
              Curious about your data?
              <br />
              <br />
              Manage your data, undo ad site restrictions, and amend your domain
              preferences at anytime via the data & ads control center.
            </p>
            <div className={"flex gap12"}>
              <Button
                text={`Do not share`}
                color={ButtonColors.SECONDARY}
                link={{
                  url: WebsiteURLs.request,
                  external: true,
                  newTab: true,
                }}
              />
              <Button
                text={`Manage Preferences`}
                color={ButtonColors.PRIMARY}
                link={{ url: InternalRoutes.data }}
              />
            </div>
          </div>
        ),
      },
    ];
  }, [
    account.email,
    account.phone,
    confirmMasterPass,
    country,
    edit,
    isPasswordValid,
    loading,
    masterPass,
    onSetPassword,
    phone,
    phoneIsValid,
    privateKey,
    safeRun,
  ]);

  return (
    <>
      <PageHeader header={"Settings"} uid={account.wallet} />
      <div className={"round bg-white card28"}>
        <MultiTabView tabs={tabs} />
      </div>
    </>
  );
}
