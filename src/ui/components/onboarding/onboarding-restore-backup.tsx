import clsx from "clsx";
import {
  ReactNode,
  useCallback,
  useContext,
  useEffect,
  useRef,
  useState,
} from "react";

import { ButtonColors } from "@/enums/button.enum";
import { CloudServices } from "@/enums/cloud.enum";
import { SystemMessage } from "@/enums/message.enum";
import { helper } from "@/helper";
import { SwashSupportURLs } from "@/paths";
import { Any } from "@/types/any.type";
import { OnlineFile } from "@/types/file.type";
import { MultiPageRef } from "@/types/ui.type";
import { OnboardingContext } from "@/ui/context/onboarding.context";
import { useErrorHandler } from "@/ui/hooks/use-error-handler";
import { isValidPrivateKey } from "@/utils/validator.util";
import BackIcon from "~/images/icons/arrow-2.svg?react";

import { BackupOption } from "../backup-option/backup-option";
import { Button } from "../button/button";
import { DynamicTable } from "../dynamic-table/dynamic-table";
import { ShowEndAdornment } from "../input/end-adornments/show-end-adornment";
import { Input } from "../input/input";
import { MultiPageView } from "../multi-page-view/multi-page-view";
import { NavigationButtons } from "../navigation-buttons/navigation-buttons";
import { closePopup, showPopup } from "../popup/popup";
import { toastMessage } from "../toast/toast-message";

import styles from "./onboarding-restore-backup.module.css";

function ImportPrivateKey({
  onSubmit,
}: {
  onSubmit: (value: string) => void;
}): ReactNode {
  const [privateKey, setPrivateKey] = useState<string>("");
  const [reveal, setReveal] = useState<boolean>(false);
  const [error, setError] = useState<boolean>(false);

  return (
    <div className={"flex col gap32 bg-white"}>
      <div className={"flex col gap12"}>
        <p className={"subHeader2"}>Private Key</p>
        <p>Your private key is like a password, make sure you’re secure!</p>
      </div>
      <Input
        name={"Private key"}
        label={"Enter your private key below: "}
        value={privateKey}
        type={reveal ? "text" : "password"}
        endAdornment={
          <ShowEndAdornment
            show={reveal}
            onClick={() => {
              setReveal(!reveal);
            }}
          />
        }
        error={error}
        onBlur={() => {
          setError(!isValidPrivateKey(privateKey));
        }}
        onChange={(e) => setPrivateKey(e.target.value)}
      />
      <div className={"flex gap16"}>
        <Button
          text={"Cancel"}
          className={"full-width-button"}
          color={ButtonColors.SECONDARY}
          onClick={() => {
            closePopup();
          }}
        />
        <Button
          text={"Restore"}
          className={"full-width-button"}
          color={ButtonColors.PRIMARY}
          disabled={error || privateKey.length !== 66}
          onClick={() => {
            onSubmit(privateKey);
          }}
        />
      </div>
    </div>
  );
}

function ImportLocalFile({
  onSelect,
}: {
  onSelect: (privateKey: string) => void;
}): ReactNode {
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  const onClick = () => {
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
      fileInputRef.current.click();
    }
  };

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.readAsText(file);
      reader.onload = async () => {
        if (typeof reader.result === "string") {
          onSelect(reader.result);
        } else {
          toastMessage("error", SystemMessage.INVALID_BACKUP_FILE);
        }
      };
      reader.onerror = () => {
        toastMessage("error", SystemMessage.FAILED_RESTORE_BACKUP_FILE);
      };
    }
  };

  return (
    <div className={"col-10"}>
      <BackupOption
        text={"Local File"}
        icon={"/images/icons/file.svg"}
        onClick={onClick}
      />
      <input
        type={"file"}
        ref={fileInputRef}
        style={{ display: "none" }}
        onChange={handleFileChange}
      />
    </div>
  );
}

export function ImportFromCloud({
  cloud,
  onSelect,
}: {
  cloud: CloudServices;
  onSelect: (value: string) => void;
}): ReactNode {
  const ref = useRef<MultiPageRef>();
  const { safeRun } = useErrorHandler();

  const [loading, setLoading] = useState<boolean>(false);
  const [file, setFile] = useState<OnlineFile>();
  const [files, setFiles] = useState<OnlineFile[]>([]);

  useEffect(() => {
    safeRun(
      async () => {
        setLoading(true);
        setFiles(await helper("restore").listCloudBackup(cloud));
      },
      {
        failure: () => {
          closePopup();
        },
        finally: () => {
          setLoading(false);
        },
      },
    );
  }, [cloud, safeRun]);

  const onDoubleClick = useCallback((file: Any) => {
    setFile(file as OnlineFile);
    ref.current?.next();
  }, []);

  const onSubmit = useCallback(() => {
    safeRun(
      async () => {
        if (file) {
          setLoading(true);
          onSelect(await helper("restore").downloadCloudBackup(cloud, file.id));
          closePopup();
        }
      },
      {
        failure: () => {
          toastMessage("error", SystemMessage.FAILED_DOWNLOAD_BACKUP_FILE);
        },
        finally: () => {
          setLoading(false);
        },
      },
    );
  }, [cloud, file, onSelect, safeRun]);

  return (
    <div className={"flex col gap32 bg-white"}>
      <MultiPageView ref={ref}>
        <>
          <div className={"flex col gap12"}>
            <p className={"subHeader2"}>File explorer</p>
            <p>Choose one your online backup file and restore</p>
          </div>
          <DynamicTable
            data={files}
            loading={loading}
            total={files.length}
            onRowDoubleClick={onDoubleClick}
          />
        </>
        <div className={"flex col gap32 bg-white"}>
          <div className={"flex col gap12"}>
            <p className={"subHeader2"}>Are you sure?</p>
            <p>
              You are about to restore the backup file &quot;{file?.name}
              &quot;.
              <br />
              <br />
              To proceed, click the Restore button. If you wish to cancel, click
              Cancel.
            </p>
          </div>
          <NavigationButtons
            onBack={() => {
              ref.current?.back();
            }}
            onNext={onSubmit}
            nextButtonText={"Restore"}
            loading={loading}
          ></NavigationButtons>
        </div>
      </MultiPageView>
    </div>
  );
}

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
    <div className={clsx("flex col gap32", styles.container)}>
      <h6>Restore backup file</h6>
      <div className={"round no-overflow flex col gap56 bg-off-white card32"}>
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
        <div className={"flex col gap24"}>
          <div className={"flex col gap20"}>
            <div className={"flex gap32"}>
              <div className={"col-10"}>
                <BackupOption
                  text={"Paste private key"}
                  icon={"/images/icons/drag-n-drop.svg"}
                  onClick={() =>
                    showPopup({
                      closable: true,
                      closeOnBackDropClick: true,
                      size: "custom",
                      content: <ImportPrivateKey onSubmit={onPrivateKey} />,
                    })
                  }
                />
              </div>
              <ImportLocalFile onSelect={onBackupFile} />
            </div>
            <div className={"flex gap32"}>
              <div className={"col-10"}>
                <BackupOption
                  text={"Dropbox"}
                  icon={"/images/icons/logos/dropbox.svg"}
                  onClick={() => {
                    showPopup({
                      closable: true,
                      closeOnBackDropClick: true,
                      size: "custom",
                      content: (
                        <ImportFromCloud
                          cloud={CloudServices.DROPBOX}
                          onSelect={onBackupFile}
                        />
                      ),
                    });
                  }}
                />
              </div>
              <div className={"col-10"}>
                <BackupOption
                  text={"Google Drive"}
                  icon={"/images/icons/logos/google-drive.svg"}
                  imageSize={{ width: 27 }}
                  onClick={() => {
                    showPopup({
                      closable: true,
                      closeOnBackDropClick: true,
                      size: "custom",
                      content: (
                        <ImportFromCloud
                          cloud={CloudServices.GOOGLE_DRIVE}
                          onSelect={onBackupFile}
                        />
                      ),
                    });
                  }}
                />
              </div>
            </div>
          </div>
          <p className={"text-center"}>
            Still having trouble?{" "}
            <a
              href={SwashSupportURLs.home}
              target={"_blank"}
              rel={"noreferrer"}
            >
              <span>Get help</span>
            </a>
          </p>
        </div>
      </div>
      <a
        className={clsx("flex align-center gap8", styles.back)}
        onClick={() => back()}
      >
        <BackIcon className={styles.icon} />
        <p className={"bold"}>Go back to log in</p>
      </a>
    </div>
  );
}
