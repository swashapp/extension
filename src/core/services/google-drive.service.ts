import { BaseCloudService } from "@/core/base/cloud.service";
import { CacheManager } from "@/core/managers/cache.manager";
import { RequestMethod } from "@/enums/api.enum";
import { CloudServices } from "@/enums/cloud.enum";
import { Any } from "@/types/any.type";
import { CloudServicesConfiguration } from "@/types/storage/configuration.type";

import { ApiService } from "./api.service";

export class GoogleDriveService extends BaseCloudService {
  private readonly api: ApiService;

  constructor(cache: CacheManager, conf: CloudServicesConfiguration) {
    super(
      CloudServices.GOOGLE_DRIVE,
      cache,
      conf.google_drive_client_key,
      "https://accounts.google.com/o/oauth2/auth",
      "https://www.googleapis.com/auth/drive.file",
    );
    this.api = new ApiService("https://www.googleapis.com", {
      timeout: conf.timeout,
    });
  }

  public async list(size = 1000) {
    this.logger.debug("Listing files from Google Drive");
    const response = await this.api.fetch({
      method: RequestMethod.GET,
      path: "/drive/v3/files",
      headers: await this.getAuthorization(),
      data: {
        q: "'root' in parents",
        fields: "files(id, name, modifiedTime, size)",
        pageSize: `${size}`,
      },
    });
    const data = await response.json();
    const files =
      data?.files.map((file: Any) => ({
        id: file.id,
        name: file.name,
        modifiedTime: file.modifiedTime,
        size: file.size ? `${(file.size / 1024).toFixed(2)} KB` : "Unknown",
      })) || [];
    this.logger.info(`Listed ${files.length} files from Google Drive`);
    return files;
  }

  public async upload(file: File) {
    this.logger.debug(`Uploading file ${file.name} to Google Drive`);
    const body = new FormData();
    body.append(
      "metadata",
      new Blob(
        [
          JSON.stringify({
            name: file.name,
            mimeType: file.type,
          }),
        ],
        { type: "application/json" },
      ),
    );
    body.append("file", file);
    const response = await this.api.fetch({
      method: RequestMethod.POST,
      path: "/upload/drive/v3/files?uploadType=multipart",
      headers: await this.getAuthorization(),
      data: body,
    });
    const result = await response.json();
    this.logger.info(`Uploaded ${file.name} to Google Drive`);
    return result;
  }

  public async download(file: string): Promise<Blob> {
    this.logger.debug(`Downloading file ${file} from Google Drive`);
    const response = await this.api.fetch({
      method: RequestMethod.GET,
      path: `/drive/v3/files/${file}?alt=media`,
      headers: await this.getAuthorization(),
    });
    const blob = await response.blob();
    this.logger.info(`Downloaded file ${file} from Google Drive`);
    return blob;
  }
}
