import { BaseError } from "@/base-error";
import { BaseCloudService } from "@/core/base/cloud.service";
import { CacheManager } from "@/core/managers/cache.manager";
import { CloudServices } from "@/enums/cloud.enum";
import { SystemMessage } from "@/enums/message.enum";
import { Managers } from "@/types/app.type";
import { OnlineFile } from "@/types/file.type";
import { CloudServicesConfiguration } from "@/types/storage/configuration.type";
import { Logger } from "@/utils/log.util";

import { DropboxService } from "./dropbox.service";
import { GoogleDriveService } from "./google-drive.service";

export class CloudService {
  private readonly cache: CacheManager;
  private readonly conf: CloudServicesConfiguration;
  private readonly logger = new Logger(this.constructor.name);

  constructor({ cache, configs }: Managers) {
    this.cache = cache;
    this.conf = configs.get("cloud_storages");
    this.logger.info("CloudService instance created");
  }

  private getHelper(service: CloudServices | CloudServices.DROPBOX) {
    let helper: BaseCloudService | undefined;

    if (service === CloudServices.GOOGLE_DRIVE) {
      this.logger.debug("Google Drive service selected");
      helper = new GoogleDriveService(this.cache, this.conf);
    } else if (service === CloudServices.DROPBOX) {
      this.logger.debug("Dropbox service selected");
      helper = new DropboxService(this.cache, this.conf);
    }
    return helper;
  }

  public async listFiles(service: CloudServices): Promise<OnlineFile[]> {
    this.logger.debug(`Listing files for service ${service}`);
    const helper = this.getHelper(service);

    const files = helper ? await helper.list() : [];
    this.logger.info(`Listed ${files.length} files`);
    return files;
  }

  public async downloadFile(
    service: CloudServices,
    file: string,
  ): Promise<string> {
    this.logger.debug(`Downloading file from service ${service}`);
    const helper = this.getHelper(service);

    if (!helper) {
      this.logger.error("Invalid cloud service type");
      throw new BaseError(SystemMessage.INVALID_CLOUD_TYPE);
    }
    const blob = await helper.download(file);
    this.logger.info("File downloaded successfully");
    return await blob.text();
  }
}
