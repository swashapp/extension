import { BaseCloudService } from "@/core/base/cloud.service";
import { CacheManager } from "@/core/managers/cache.manager";
import { RequestMethod } from "@/enums/api.enum";
import { CloudServices } from "@/enums/cloud.enum";
import { Any } from "@/types/any.type";
import { CloudServicesConfiguration } from "@/types/storage/configuration.type";

import { ApiService } from "./api.service";

export class DropboxService extends BaseCloudService {
  private readonly api: ApiService;
  private readonly contentApi: ApiService;

  constructor(cache: CacheManager, conf: CloudServicesConfiguration) {
    super(
      CloudServices.DROPBOX,
      cache,
      conf.dropbox_client_key,
      "https://www.dropbox.com/oauth2/authorize",
      "",
      conf.token_ttl,
    );

    this.api = new ApiService("https://api.dropboxapi.com", {
      timeout: conf.timeout,
    });
    this.contentApi = new ApiService("https://content.dropboxapi.com", {
      timeout: conf.timeout,
    });
  }

  public async list(size = 1000) {
    this.logger.debug("Listing files from Dropbox");
    const response = await this.api.fetch({
      method: RequestMethod.POST,
      path: "/2/files/list_folder",
      headers: {
        ...(await this.getAuthorization()),
        "Content-Type": "application/json",
      },
      data: {
        path: "",
        limit: size,
      },
    });
    const data = await response.json();
    const entries = data?.entries || [];
    this.logger.info(`Listed ${entries.length} files from Dropbox`);
    return entries.map((entry: Any) => ({
      id: entry.id,
      name: entry.name,
      modifiedTime: entry.client_modified,
      size: entry.size ? `${(entry.size / 1024).toFixed(2)} KB` : "Unknown",
    }));
  }

  public async upload(file: File) {
    this.logger.debug(`Uploading file ${file.name} to Dropbox`);
    const response = await this.contentApi.fetch({
      method: RequestMethod.POST,
      path: "/2/files/upload",
      headers: {
        ...(await this.getAuthorization()),
        "Dropbox-API-Arg": JSON.stringify({
          path: `/${file.name}`,
          mode: "add",
          mute: false,
        }),
        "Content-Type": "application/octet-stream",
      },
      data: file,
    });
    const result = await response.json();
    this.logger.info(`Uploaded ${file.name} to Dropbox`);
    return result;
  }

  public async download(file: string): Promise<Blob> {
    this.logger.debug(`Downloading file ${file} from Dropbox`);
    const response = await this.contentApi.fetch({
      method: RequestMethod.POST,
      path: "/2/files/download",
      headers: {
        ...(await this.getAuthorization()),
        "Dropbox-API-Arg": JSON.stringify({ path: file }),
      },
    });
    const blob = await response.blob();
    this.logger.info(`Downloaded file ${file} from Dropbox`);
    return blob;
  }
}
