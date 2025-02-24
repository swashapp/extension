import { downloads } from "webextension-polyfill";

import { BaseCloudService } from "@/core/base/cloud.service";
import { CloudServices } from "@/enums/cloud.enum";
import { Managers } from "@/types/app.type";
import { formatDate } from "@/utils/date.util";
import { Logger } from "@/utils/log.util";

import { DropboxService } from "./dropbox.service";
import { GoogleDriveService } from "./google-drive.service";

function generateName(): string {
  return `Swash-backup-${formatDate(undefined, "YYMMDDHHmm")}.json`;
}

export class BackupService {
  private readonly DATA_TYPE = "application/json; charset=utf-8";
  private readonly logger = new Logger(this.constructor.name);

  constructor(protected managers: Managers) {
    this.logger.info("Backup service initialized");
  }

  private create(): string {
    const backupContent = JSON.stringify({
      version: 1,
      wallet: this.managers.wallet.getAll(),
      privacy: this.managers.privacy.getAll(),
      preferences: {
        extension: this.managers.preferences.getAll(),
      },
    });
    this.logger.debug("Created backup content");
    return backupContent;
  }

  public async download() {
    this.logger.debug("Starting backup download process");
    const backupUrl =
      `data:${this.DATA_TYPE},` + encodeURIComponent(this.create());
    await downloads.download({
      url: backupUrl,
      filename: generateName(),
      saveAs: true,
    });
    this.logger.info("Backup download completed");
  }

  public async uploadToCloud(service: CloudServices): Promise<void> {
    this.logger.debug("Initiating cloud upload for backup");
    let helper: BaseCloudService | undefined;

    if (service === CloudServices.GOOGLE_DRIVE) {
      helper = new GoogleDriveService(
        this.managers.cache,
        this.managers.configs.get("cloud_storages"),
      );
      this.logger.debug("Google Drive service selected");
    } else if (service === CloudServices.DROPBOX) {
      helper = new DropboxService(
        this.managers.cache,
        this.managers.configs.get("cloud_storages"),
      );
      this.logger.debug("Dropbox service selected");
    } else {
      this.logger.error("Unsupported cloud service");
    }

    if (helper) {
      const backupFile = new File([this.create()], generateName(), {
        type: this.DATA_TYPE,
      });
      await helper.upload(backupFile);
      this.logger.info("Backup uploaded to cloud");
    }
  }
}
