import clsx from "clsx";
import { ReactNode, useCallback, useEffect, useRef, useState } from "react";

import { ButtonColors } from "@/enums/button.enum";
import { CloudServices } from "@/enums/cloud.enum";
import { SystemMessage } from "@/enums/message.enum";
import { helper } from "@/helper";
import { Any } from "@/types/any.type";
import { OnlineFile } from "@/types/file.type";
import { MultiPageRef } from "@/types/ui.type";
import { BackupOption } from "@/ui/components/backup-restore/backup-option";
import { Button } from "@/ui/components/button/button";
import { DynamicTable } from "@/ui/components/dynamic-table/dynamic-table";
import { ShowEndAdornment } from "@/ui/components/input/end-adornments/show-end-adornment";
import { Input } from "@/ui/components/input/input";
import { MultiPageView } from "@/ui/components/multi-page-view/multi-page-view";
import { NavigationButtons } from "@/ui/components/navigation-buttons/navigation-buttons";
import { closePopup, showPopup } from "@/ui/components/popup/popup";
import { toastMessage } from "@/ui/components/toast/toast-message";
import { useErrorHandler } from "@/ui/hooks/use-error-handler";
import { isValidPrivateKey } from "@/utils/validator.util";
import DragNDropIcon from "~/images/icons/drag-n-drop.svg?react";
import FileIcon from "~/images/icons/file.svg?react";
import DropboxIcon from "~/images/icons/logos/dropbox.svg?react";
import GoogleDriveIcon from "~/images/icons/logos/google-drive.svg?react";

import styles from "./restore-menu.module.css";

function PrivateKey({
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

function LocalFile({
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
      <BackupOption text={"Local File"} icon={<FileIcon />} onClick={onClick} />
      <input
        type={"file"}
        ref={fileInputRef}
        style={{ display: "none" }}
        onChange={handleFileChange}
      />
    </div>
  );
}

function CloudFile({
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
        setFiles(await helper("cloud").listFiles(cloud));
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
          onSelect(await helper("cloud").downloadFile(cloud, file.id));
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

export function RestoreMenu({
  onPrivateKey,
  onBackupFile,
}: {
  onPrivateKey: (privateKey: string) => void;
  onBackupFile: (backup: string) => void;
}): ReactNode {
  return (
    <div className={"flex col gap20"}>
      <div className={clsx("flex gap32", styles.row)}>
        <div className={"col-10"}>
          <BackupOption
            text={"Paste private key"}
            icon={<DragNDropIcon />}
            onClick={() =>
              showPopup({
                closable: true,
                closeOnBackDropClick: true,
                size: "custom",
                content: <PrivateKey onSubmit={onPrivateKey} />,
              })
            }
          />
        </div>
        <LocalFile onSelect={onBackupFile} />
      </div>
      <div className={clsx("flex gap32", styles.row)}>
        <div className={"col-10"}>
          <BackupOption
            text={"Dropbox"}
            icon={<DropboxIcon />}
            onClick={() => {
              showPopup({
                closable: true,
                closeOnBackDropClick: true,
                size: "custom",
                content: (
                  <CloudFile
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
            icon={<GoogleDriveIcon width={27} />}
            onClick={() => {
              showPopup({
                closable: true,
                closeOnBackDropClick: true,
                size: "custom",
                content: (
                  <CloudFile
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
  );
}
