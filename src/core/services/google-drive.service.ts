import { RequestMethod } from "@/enums/api.enum";
import { CloudServices } from "@/enums/cloud.enum";
import { Any } from "@/types/any.type";

import { BaseCloudService } from "../base/cloud.service";
import { CacheManager } from "../managers/cache.manager";

import { ApiService } from "./api.service";

export class GoogleDriveService extends BaseCloudService {
  private readonly api: ApiService;

  constructor(cache: CacheManager) {
    super(
      CloudServices.GOOGLE_DRIVE,
      cache,
      "1008037433533-fk4mar25609d75s1jv3pvohgfldtl8rj.apps.googleusercontent.com",
      "https://accounts.google.com/o/oauth2/auth",
      "https://www.googleapis.com/auth/drive.file",
    );
    this.api = new ApiService("https://www.googleapis.com", { timeout: 5000 });
  }

  async list(size = 1000) {
    const response = await this.api.fetch(`/drive/v3/files`, {
      method: RequestMethod.GET,
      headers: await this.getAuthorization(),
      data: {
        q: "'root' in parents",
        fields: "files(id, name, modifiedTime, size)",
        pageSize: `${size}`,
      },
    });

    const data = await response.json();
    return (
      data?.files.map((file: Any) => ({
        id: file.id,
        name: file.name,
        modifiedTime: file.modifiedTime,
        size: file.size ? `${(file.size / 1024).toFixed(2)} KB` : "Unknown",
      })) || []
    );
  }

  async upload(file: File) {
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

    const response = await this.api.fetch(
      "/upload/drive/v3/files?uploadType=multipart",
      {
        method: RequestMethod.POST,
        headers: await this.getAuthorization(),
        data: body,
      },
    );

    return await response.json();
  }

  async download(file: string): Promise<Blob> {
    const response = await fetch(`/drive/v3/files/${file}?alt=media`, {
      method: RequestMethod.GET,
      headers: await this.getAuthorization(),
    });

    return await response.blob();
  }
}
